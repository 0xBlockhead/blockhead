<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/~/(multiplayer)/multiplayer/(rooms)/room/[roomId]',
			{ roomId: entityId.id },
		),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadRoom>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()

	const room = useEntity(entityCollectionsContext, EntityType.BlockheadRoom,
		entityId,
		({ sources: [
				Source.Local_Internal,
			], fields: { name: true, createdAt: true, createdBy: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoom}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(room)}
				{room.fields.name ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			WebRTC-style rooms synchronize ephemeral presence—cursors, avatars, shared focus—between joined clients.
		</p>
		<p>
			That transport differs from federated ActivityPub threads, Reddit HTTP threads, or XMTP double-ratchet DMs.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={room}
						placeholderText="Loading room…"
					>
						{#snippet children(room)}
							{#if room.fields.createdAt !== undefined}
								<Timestamp
									timestamp={room.fields.createdAt}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Opened by</dt>
					<dd>
						<ResourceBoundary
							resource={room}
							placeholderText="Loading room…"
						>
							{#snippet children(room)}
								{#if room.fields.createdBy !== undefined && room.fields.createdBy !== ''}
									{room.fields.createdBy}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

</EntityView>
