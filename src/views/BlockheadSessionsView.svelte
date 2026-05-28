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
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Simulator sessions',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSession
			>
			title?: string
			open?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadSession}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Saved simulation projects: named capture points, loop counters, and replay bookkeeping for scripted EVM or HTTP traces.
		</p>
		<p>
			Such traces are diagnostics—compare their implied state roots to a live node instead of treating them as canonical chain history.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No sessions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Local_Internal,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const sessions = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.BlockheadSession>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadSession}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				resource={sessions}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No sessions yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<BlockheadSessionView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
