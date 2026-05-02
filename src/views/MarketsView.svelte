<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityFieldReference } from '$/schema/index.ts'
	import { stringify } from 'devalue'

	import { isMarketEntityId } from '$/lib/isMarketEntityId.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


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
			entityFieldReference: EntityFieldReference<typeof EntityType.Market>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// (Derived)
	const marketsQuery = useLiveQuery(
		(queryBuilder) => {
			const pk = stringify(entityFieldReference.entityId)
			return (
				queryBuilder
					.from({ m: entityFieldCollections[EntityType._Global]['$$markets']! })
					.where(({ m }) => (
						eq(
							m[EntityMetaKey.ParentIdKey],
							pk,
						)
					))
					.select(({ m }) => (
						{ market: m[EntityMetaKey.Value] }
					))
			)
		},
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	const marketRowKey = (row) => (
		stringify(
			row.market,
		)
	)

	const marketRows = $derived(
		[
			...(
				(marketsQuery.data ?? [])
					.reduce(
						(rowsByKey, row) => {
							if (!isMarketEntityId(row.market)) {
								return rowsByKey
							}
							rowsByKey.set(
								stringify(row.market),
								row,
							)
							return rowsByKey
						},
						new Map(),
					)
					.values()
			),
		],
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
	getSortValue={marketRowKey}
	items={new SvelteSet(marketRows)}
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
				entityId={row.market}
				href={resolve(
					'/(assets)/coins/market/[marketKey]',
					{
						marketKey: (
							encodeURIComponent(
								stringify(
									row.market,
								),
							)
						),
					},
				)}
				id={stringify(row.market)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
