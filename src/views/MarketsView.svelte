<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


	// Props
	let {
		title = 'Markets',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// (Derived)
	const marketsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
						m: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName],
					})
				.where(({ m }) => (
						eq(
							m[EntityMetaKey.ParentIdKey],
							stringify(entityFieldReference.entityId),
						)
					))
				.leftJoin(
						{ quoteLink: entityFieldCollections[EntityType.Market].$$quotes },
						({ m, quoteLink }) => (
							eq(
								quoteLink[EntityMetaKey.ParentIdKey],
								m[EntityMetaKey.Value][EntityMetaKey.IdKey],
							)
						),
					)
				.leftJoin(
						{ quote: entityCollectionByEntityType[EntityType.Market_Timestamp] },
						({ quoteLink, quote }) => (
							eq(
								quote[EntityMetaKey.IdKey],
								quoteLink[EntityMetaKey.Value][EntityMetaKey.IdKey],
							)
						),
					)
				.select(({ m, quote }) => ({
						...m[EntityMetaKey.Value],
						volumeSort: quote?.volume24h,
						quoteTimestampNs: quote?.[EntityMetaKey.Id].timestampNs,
					}))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	const marketRowKey = (row: Entity<typeof schema, EntityType.Market> & { volumeSort?: bigint, quoteTimestampNs?: bigint }) => (
		stringify(
			row[EntityMetaKey.Id],
		)
	)

	const marketRows = $derived(
		Object.values(
			Object.groupBy(
				marketsQuery.data ?? [],
				marketRowKey,
			),
		)
			.map((rows) => (
				rows
					?.sort((a, b) => (
						a.quoteTimestampNs === undefined ?
							1
						: b.quoteTimestampNs === undefined ?
							-1
						: a.quoteTimestampNs < b.quoteTimestampNs ?
							1
						: a.quoteTimestampNs > b.quoteTimestampNs ?
							-1
						:
							0
					))[0]
			))
			.filter((row) => row !== undefined),
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Market}
	{title}
	getKey={marketRowKey}
	getSortValue={(row) => (
		row.volumeSort === undefined ?
			0
		:
			-Number(row.volumeSort / 1_000_000n)
	)}
	items={marketRows}
	placeholderKeys={new SvelteSet<string | number>()}
	query={marketsQuery}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No market rows yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			<MarketView
				entityId={row[EntityMetaKey.Id]}
				href={resolve(
					'/(assets)/coins/market/[marketKey]',
					{
						marketKey: (
							encodeURIComponent(
								stringify(
									row[EntityMetaKey.Id],
								),
							)
						),
					},
				)}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
