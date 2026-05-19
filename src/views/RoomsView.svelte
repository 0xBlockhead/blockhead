<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntitiesList from '$/components/EntitiesList.svelte'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


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


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				}
			:
				{}
		),
	)

	const rooms = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.BlockheadRoom>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					stringify(a[EntityMetaKey.Id]).localeCompare(stringify(b[EntityMetaKey.Id]))
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import RoomView from '$/views/RoomView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.BlockheadRoom}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={rooms}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Collaboration rooms are live sessions for shared presence and state with invited peers.
		</p>
		<p>
			They are not forum threads, end-to-end direct messages, static file links, threaded forums, XMTP DMs, or immutable ledger records.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No collaboration rooms yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const roomId = props.item.value[EntityMetaKey.Id]}
			<RoomView
				entityId={roomId}
				href={resolve(
					'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
					{ roomId: roomId.id },
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>

