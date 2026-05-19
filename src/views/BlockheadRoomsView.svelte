<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Collaboration rooms',
		open = $bindable(true),
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadRoom
			>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	const global = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		(
			open ?
				{
					$: [Source.Local_Internal],
					$$blockheadRooms: {},
				}
			:
				{
					$: [Source.Local_Internal],
				}
		),
	)

	const rooms = derive(
		global,
		(global) => (
			global['$$blockheadRooms'] ?? []
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BlockheadRoom}
	{href}
	{id}
	{title}
	bind:open
	getKey={(row) => stringify(row[EntityMetaKey.Id])}
	getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
	resource={rooms}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
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

	{#snippet Item({ item: row })}
		{#if row}
			<BlockheadRoomView
				entityId={row[EntityMetaKey.Id]}
				href={resolve(
					'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
					{ roomId: row[EntityMetaKey.Id].id },
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
