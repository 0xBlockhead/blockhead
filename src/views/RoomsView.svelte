<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
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

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RoomView from '$/views/RoomView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.BlockheadRoom}
	{id}
	{title}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Local_Internal,
						],
					},
				} }),
			)}
			{@const rooms = derive(
				parent,
				(parent) => {
					const blockheadRooms: readonly Entity<typeof schema, EntityType.BlockheadRoom>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return (
						blockheadRooms.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadRoom}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				id={`${id}-items`}
				open={true}
				resource={rooms}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No collaboration rooms yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const roomId = item.value[EntityMetaKey.Id]}
					<RoomView
						entityId={roomId}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
