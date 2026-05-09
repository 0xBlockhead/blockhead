<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// Props
	let {
		entityFieldReference,

		title = 'Bridges',

		open = $bindable(true),

		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkBridge>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const bridgesQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					bridgeFieldRow: entityFieldCollections[EntityType.Network]['$$bridges'],
				})
				.where(({ bridgeFieldRow }) => (
					eq(
						bridgeFieldRow[EntityMetaKey.ParentIdKey],
						stringify(entityFieldReference.entityId),
					)
				))
				.select(({ bridgeFieldRow }) => (
					{ value: bridgeFieldRow[EntityMetaKey.Value] }
				))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)


	// Components
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import OrderedList from '$/components/OrderedList.svelte'
	import NetworkBridgeView from '$/views/NetworkBridgeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkBridge}
	{title}
	bind:open
	{...entitiesListProps}
>
	{#snippet body()}
		<QueryBoundary
			query={bridgesQuery}
			placeholderText="Loading bridges…"
		>
			{#snippet children(_bridges)}
				<OrderedList
					items={bridgesQuery.data?.map(({ value }) => value) ?? []}
					getKey={(row) => row[EntityMetaKey.Id].url}
					placeholderRanges={[]}
					orientation={ListOrientation.Column}
				>
					{#snippet Empty()}{/snippet}

					{#snippet Item({ item: row, isPlaceholder })}
						{#if isPlaceholder}
							<span data-placeholder>
								…
							</span>
						{:else if row}
							<NetworkBridgeView
								entityId={row[EntityMetaKey.Id]}
								href={row[EntityMetaKey.Id].url}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</OrderedList>
			{/snippet}
		</QueryBoundary>
	{/snippet}
</EntitiesList>
