<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

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
		title = 'Rooms',
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


	const globalEntity = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			$: [Source.Local_Internal],
			$$blockheadRooms: {},
		},
	)

	const rooms = derive(
		globalEntity,
		(globalRow) => (
			globalRow['$$blockheadRooms'] ?? []
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
