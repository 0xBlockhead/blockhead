<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		title = 'Collaboration rooms',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadRoom
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

	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadRoom}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Realtime collaboration rooms: stable ids plus host metadata for synchronized presence and shared cursors/state.
		</p>
		<p>
			They ride on WebRTC or similar transports—separate persistence from chat logs (XMTP), Farcaster feeds, or beacon consensus.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No rooms yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const global = useEntity(entityCollectionsContext, EntityType._Global,
				entityFieldReference.entityId,
				({ sources: [Source.Local_Internal], fields: { $$blockheadRooms: true } }),
			)}

			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadRoom}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(room) => stringify(room[EntityMetaKey.Id])}
				getSortValue={(room) => stringify(room[EntityMetaKey.Id])}
				resource={
					derive(
						global,
						(global) => (
							global['$$blockheadRooms'] ?? []
						),
					)
				}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No rooms yet.
					</p>
				{/snippet}

				{#snippet Item({ item: room })}
					<BlockheadRoomView
						entityId={room[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
