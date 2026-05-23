<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadRoomPeer>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	const peer = useEntity(
		EntityType.BlockheadRoomPeer,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			displayName: {},
			isConnected: {},
			...(open ?
				{
					$room: {},
					peerId: {},
				}
			:
				{}),
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
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
			resource={peer}
			placeholderText="Loading peer…"
		>
			{#snippet children(peer)}
				{titleProp ?? peer.displayName ?? peer.peerId ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Membership row for a realtime room: human-readable label, underlying peer id, and transport connection flags.
		</p>
		<p>
			<code>isConnected</code> reflects WebRTC or signaling reachability for that peer endpoint—not chain balances, Farcaster custody keys, or XMTP inbox material.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Connected to you</dt>
				<dd>
					<ResourceBoundary resource={peer}>
						{#snippet children(peer)}
							{peer.isConnected ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Multiplayer role</dt>
				<dd>
					Session collaborator visibility.
				</dd>
			</div>

			{#if open}
				{#if peer.peerId !== undefined && peer.peerId !== ''}
					<div>
						<dt>libp2p peer ID</dt>
						<dd>
							<ResourceBoundary resource={peer}>
								{#snippet children(peer)}
									{peer.peerId}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if peer.$room?.id != null && peer.$room.id !== ''}
					<div>
						<dt>Room session</dt>
						<dd>
							<ResourceBoundary resource={peer}>
								{#snippet children(peer)}
									{peer.$room.id}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadRoomPeer}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
