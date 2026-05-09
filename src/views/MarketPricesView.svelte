<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { coinById } from '$/constants/Coin.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketPrice>
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
				.from({
					$$prices: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName],
				})
				.where(({ $$prices }) => (
					eq(
						$$prices[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.select(({ $$prices }) => (
					{ value: $$prices[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	const marketPriceRowKey = (
		row: Entity<typeof schema, EntityType.MarketPrice>,
	) => (
		stringify(
			row[EntityMetaKey.Id],
		)
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
	getKey={marketPriceRowKey}
	getSortValue={(row) => (
		row[EntityMetaKey.Id].$market.$base.kind === MarketAssetKind.Coin ?
			row[EntityMetaKey.Id].$market.$base.$coin.coinId
		:
			''
	)}
	items={marketPricesQuery.data?.map(({ value }) => value) ?? []}
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
			<MarketPriceView
				entityId={row[EntityMetaKey.Id]}
				href={(
					row[EntityMetaKey.Id].$market.$base.kind !== MarketAssetKind.Coin ?
						undefined
					: coinById[row[EntityMetaKey.Id].$market.$base.$coin.coinId] == null ?
						undefined
					:	resolve(
							'/(assets)/(coins)/coin/[coinId]',
							{ coinId: row[EntityMetaKey.Id].$market.$base.$coin.coinId },
						)
				)}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
