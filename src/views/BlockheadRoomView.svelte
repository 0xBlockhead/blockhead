<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadRoom> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRoom = $derived(viewSelection({
		fields: {
			name: true,
			createdAt: true,
			createdBy: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.name ?? '') || (pendingEntity.id ?? '') || 'room')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/~/multiplayer/room/[roomId=stringSegment]',
			{
				roomId: String(selection.entitySelector.id),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadRoom}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRoom}>
			{#snippet children(entity)}
				<Timestamp timestamp={Number(entity.createdAt)} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{pendingEntity.id}
				</dd>
			</div>

			<div>
				<dt>Created by</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRoom}
					>
						{#snippet children(entity)}
							{entity.createdBy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRoom}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.createdAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadRoomBlockheadRoomPeersViewPeersResource = selection.$$peers}
		<ResourceBoundary
			resource={blockheadRoomBlockheadRoomPeersViewPeersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadRoomPeersView
						selection={blockheadRoomBlockheadRoomPeersViewPeersResource}
						countResource={blockheadRoomBlockheadRoomPeersViewPeersResource.count}
						title='Peers'
						id='peers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
