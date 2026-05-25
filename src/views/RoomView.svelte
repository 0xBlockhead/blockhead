<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const room = useEntity(
		EntityType.BlockheadRoom,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			name: {},
			createdAt: {},
			createdBy: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
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
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={room}
			placeholderText="Loading room…"
		>
			{#snippet children(loadedRoom)}
				{loadedRoom.name ?? entityId.id}
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={room}
						placeholderText="Loading room…"
					>
						{#snippet children(loadedRoom)}
							{#if loadedRoom.createdAt !== undefined}
								<Timestamp
									timestamp={loadedRoom.createdAt}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Name</dt>
					<dd>
						<ResourceBoundary
							resource={room}
							placeholderText="Loading room…"
						>
							{#snippet children(loadedRoom)}
								{#if loadedRoom.name !== undefined && loadedRoom.name !== ''}
									{loadedRoom.name}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Opened by</dt>
					<dd>
						<ResourceBoundary
							resource={room}
							placeholderText="Loading room…"
						>
							{#snippet children(loadedRoom)}
								{#if loadedRoom.createdBy !== undefined && loadedRoom.createdBy !== ''}
									{loadedRoom.createdBy}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}

				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
