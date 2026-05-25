<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Props
	let {
		title = 'Finality',
		open = $bindable(true),
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network_BeaconFinality_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'id'
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Beacon_Rest,
				],
				$limit: 8,
			},
		},
	)

	const rows = derive(
		parent,
		(parent) => {
			const list: Entity<typeof schema, EntityType.Network_BeaconFinality_Timestamp>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				list
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Network_BeaconFinality_TimestampView from '$/views/Network_BeaconFinality_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.Network_BeaconFinality_Timestamp}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		-Number(row.value[EntityMetaKey.Id].timestampMs)
	)}
	placeholderKeys={new SvelteSet<string>()}
	placeholderText="Loading finality…"
	resource={rows}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a head-state snapshot of justified and finalized beacon checkpoints (epoch and root pairs) from the consensus REST API.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No finality checkpoints yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{@const row = item.value}
		<Network_BeaconFinality_TimestampView
			entityId={row[EntityMetaKey.Id]}
			layout={EntityLayout.SummaryDetails}
			open={true}
			showTypeAnnotation={false}
		/>
	{/snippet}
</EntitiesList>
