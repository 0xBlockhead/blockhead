<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
		// State
	let {
		selection,
		title = 'Collaboration rooms',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadRoom>
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

	import { select } from '$/routes/+layout.svelte'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{@const rooms = select(EntityType._Global,
				selection.entitySelector,
				{ sources: [Source.Local_Internal] },
			).$$blockheadRooms({
				sources: [Source.Local_Internal],
			})}

			<ResourceBoundary resource={rooms} placeholderText="Loading rooms…">
				{#snippet children(rooms)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadRoom}
						id={`${id}-items`}
						{title}
						open={true}
						items={rooms.entities}
						getKey={(room) => stringify(room.entitySelector)}
						getSortValue={(room) => stringify(room.entitySelector)}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No rooms yet.
							</p>
						{/snippet}

						{#snippet Item({ item: room })}
							<BlockheadRoomView
								selection={select(EntityType.BlockheadRoom, room.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
