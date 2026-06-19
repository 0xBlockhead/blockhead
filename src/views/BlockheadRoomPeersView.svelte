<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection = select(
			EntityType._Global,
			{ scope: '$$blockheadRoomPeers' },
			{
				sources: [Source.Local_Internal],
			}
		).$$blockheadRoomPeers,
		title = 'Room peers',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection?: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadRoomPeer>
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



	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(peers)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadRoomPeer}
						getKey={(row) => row.entitySelector.id}
						getSortValue={(row) => row.entitySelector.id}
						id={`${id}-items`}
						open={true}
						items={peers.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No peers yet.</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadRoomPeerView
								selection={select(EntityType.BlockheadRoomPeer, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
