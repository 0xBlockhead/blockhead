<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { formatMarketTimeIntervalLabel, MarketAssetKind } from '$/constants/Market.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.MarketPriceRange>
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
				.from({
					range: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName],
				})
				.where(({ range }) => (
					eq(
						range[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.select(({ range }) => (
					{ value: range[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	const marketPriceRangeRowKey = (
		row: Entity<typeof schema, EntityType.MarketPriceRange>,
	) => (
		stringify(
			row[EntityMetaKey.Id],
		)
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
	getKey={marketPriceRangeRowKey}
	getSortValue={(row) => (
		`${(
			row[EntityMetaKey.Id].$market.$base.kind === MarketAssetKind.Coin ?
				row[EntityMetaKey.Id].$market.$base.$coin.coinId
			:
				''
		)} ${formatMarketTimeIntervalLabel(row[EntityMetaKey.Id].timeInterval)}`
	)}
	items={marketPriceRangeFieldQuery.data?.map(({ value }) => value) ?? []}
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
			<MarketPriceRangeView
				entityId={row[EntityMetaKey.Id]}
				href={(
					row[EntityMetaKey.Id].$market.$base.kind !== MarketAssetKind.Coin ?
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
