<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { formatMarketTimeIntervalLabel, MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import MarketPriceRangeSchema from '$/schema/MarketPriceRange.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'OHLC',
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
				fieldName: '$$marketPriceRanges'
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
	const marketPriceRangeFieldQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ range: entityFieldCollections[EntityType._Global]['$$marketPriceRanges']! })
				.where(({ range }) => (
					eq(
						range[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.select(({ range }) => ({
					range: range[EntityMetaKey.Value],
				}))
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	type RangeRow = (NonNullable<typeof marketPriceRangeFieldQuery.data>)[number]

	const projectRangeRow = (row: RangeRow) => {
		const entityId = (
			(row.range as Record<string, unknown>)[EntityMetaKey.Id] as typeof MarketPriceRangeSchema.id.infer
		)
		const coinId = (
			entityId.$market.$base.kind === MarketAssetKind.Coin ?
				entityId.$market.$base.$coin.coinId
			:
				undefined
		)
		return {
			coinId,
			entityId,
			key: stringify(entityId),
			sortKey: `${coinId ?? ''} ${formatMarketTimeIntervalLabel(entityId.timeInterval)}`,
		}
	}

	const rangeRows = $derived(
		Array.from(
			(marketPriceRangeFieldQuery.data ?? [])
				.reduce(
					(rowsByKey, row: RangeRow) => {
						if (row.range === undefined) {
							return rowsByKey
						}
						const projected = projectRangeRow(row)
						rowsByKey.set(
							projected.key,
							row,
						)
						return rowsByKey
					},
					new Map<string, RangeRow>(),
				)
				.values(),
		),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketPriceRangeView from '$/views/MarketPriceRangeView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.MarketPriceRange}
	getKey={(row) => projectRangeRow(row).key}
	getSortValue={(row) => projectRangeRow(row).sortKey}
	items={new SvelteSet(rangeRows)}
	placeholderKeys={new SvelteSet<string | number>()}
	query={marketPriceRangeFieldQuery}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No candle ranges in the index yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else}
			{@const projected = projectRangeRow(row)}
			<MarketPriceRangeView
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
