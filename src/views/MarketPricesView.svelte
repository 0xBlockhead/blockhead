<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import MarketPriceSchema from '$/schema/MarketPrice.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Market prices',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: {
				entityType: EntityType._Global
				entityId: Record<string, never>
				fieldName: '$$marketPrices'
			}
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// (Derived)
	const marketPricesQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$prices: entityFieldCollections[EntityType._Global]['$$marketPrices']! })
				.where(({ $$prices }) => (
					eq(
						$$prices[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.select(({ $$prices }) => ({
					price: $$prices[EntityMetaKey.Value],
				}))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	type PriceRow = (NonNullable<typeof marketPricesQuery.data>)[number]

	const projectPriceRow = (row: PriceRow) => {
		const entityId = (
			(row.price as Record<string, unknown>)[EntityMetaKey.Id] as typeof MarketPriceSchema.id.infer
		)
		return {
			coinId: entityId.$market.$base.kind === MarketAssetKind.Coin ?
				entityId.$market.$base.$coin.coinId
			:
				undefined,
			entityId,
			key: stringify(entityId),
		}
	}

	const priceRows = $derived(
		Array.from(
			(marketPricesQuery.data ?? [])
				.reduce(
					(rowsByKey, row: PriceRow) => {
						if (row.price === undefined) {
							return rowsByKey
						}
						const projected = projectPriceRow(row)
						rowsByKey.set(
							projected.key,
							row,
						)
						return rowsByKey
					},
					new Map<string, PriceRow>(),
				)
				.values(),
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	entityType={EntityType.MarketPrice}
	{title}
	bind:open
	getKey={(row) => projectPriceRow(row).key}
	getSortValue={(row) => projectPriceRow(row).coinId ?? ''}
	items={new SvelteSet(priceRows)}
	placeholderKeys={new SvelteSet<string | number>()}
	query={marketPricesQuery}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No market price rows yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else}
			{@const projected = projectPriceRow(row)}
			<MarketPriceView
				entityId={projected.entityId}
				href={(
					projected.coinId === undefined ?
						undefined
					:	resolve(
							'/(assets)/(coins)/coin/[coinId]',
							{ coinId: projected.coinId },
						)
				)}
				id={projected.key}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
