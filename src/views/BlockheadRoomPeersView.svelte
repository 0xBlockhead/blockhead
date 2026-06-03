<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/$Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference = {
			entityType: EntityType._Global,
			entityId: { scope: '$$blockheadRoomPeers' },
			fieldName: '$$blockheadRoomPeers',
		},
		title = 'Room peers',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference?: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadRoomPeer
			>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadRoomPeer}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Realtime peers attached to the multiplayer room—who is connected over the mesh for collaboration.
		</p>
		<p>
			Not the same as Farcaster contacts, wallet sessions, or beacon validators.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No peers yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				},
			)}
			{@const peers = derive(
				parent,
				(parent) => {
					const blockheadRoomPeers: Entity<typeof schema, EntityType.BlockheadRoomPeer>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						blockheadRoomPeers.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadRoomPeer}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(envelope) => envelope.value[EntityMetaKey.Id].id}
				getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].id}
				resource={peers}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No peers yet.
					</p>
				{/snippet}

				{#snippet Item({ item: envelope })}
					<BlockheadRoomPeerView
						entityId={envelope.value[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
