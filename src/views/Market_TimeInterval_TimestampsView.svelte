<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		title = 'Points',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market_TimeInterval_Timestamp>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// (Derived)
	const marketTimeIntervalTimestampsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
						row: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName],
					})
				.where(({ row }) => (
						eq(
							row[EntityMetaKey.ParentIdKey],
							stringify(entityFieldReference.entityId),
						)
					))
				.select(({ row }) => (
						{ value: row[EntityMetaKey.Value] }
					))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	const marketTimeIntervalTimestampRowKey = (
		row: Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
	) => (
		stringify(
			row[EntityMetaKey.Id],
		)
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Market_TimeInterval_Timestamp}
	{title}
	getKey={marketTimeIntervalTimestampRowKey}
	getSortValue={(row) => String(row[EntityMetaKey.Id].timestampNs)}
	items={marketTimeIntervalTimestampsQuery.data?.map(({ value }) => value) ?? []}
	placeholderKeys={new SvelteSet<string | number>()}
	query={marketTimeIntervalTimestampsQuery}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No points yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			<Market_TimeInterval_TimestampView
				entityId={row[EntityMetaKey.Id]}
				href={resolve('/(assets)/coins/market/[marketKey]', {
					marketKey: encodeURIComponent(stringify(row[EntityMetaKey.Id].$market)),
				})}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
