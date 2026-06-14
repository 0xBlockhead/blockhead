	<script lang="ts">
	// Types/constants
		import type { ComponentProps } from 'svelte'
		import { EntityMetaKey } from '$/schema/$schema.ts'
		import { EntityType } from '$/schema/EntityType.ts'
		import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
			selector,
			href = resolve(
				'/~/(multiplayer)/multiplayer/(contacts)/contact/[contactId]',
				{
					contactId: selector.id,
				},
			),
		title: titleProp,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BlockheadRoomPeer>
			href?: string
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	
	const peer = subscribe(EntityType.BlockheadRoomPeer,
		selector,
		({ sources: [
				Source.Local_Internal,
			], fields: { displayName: true, isConnected: true, ...(open ? ({ $room: true, peerId: true, joinedAt: true, lastSeenAt: true, connectedAt: true, disconnectedAt: true }) : ({  })) } }),
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={peer}
			placeholderText="Loading peer…"
		>
			{#snippet children(peer)}
				{titleProp ?? peer.fields.displayName ?? peer.fields.peerId ?? selector.id}
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

	{#snippet Content({})}
		<dl>
			<div>
				<dt>Connected to you</dt>
				<dd>
					<ResourceBoundary resource={peer}>
						{#snippet children(peer)}
							{peer.fields.isConnected ? 'Yes' : 'No'}
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

				<ResourceBoundary resource={peer}>
					{#snippet children(peer)}
						{#if peer.fields.peerId !== undefined && peer.fields.peerId !== ''}
							<div>
								<dt>libp2p peer ID</dt>
								<dd>
									{peer.fields.peerId}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={peer}>
					{#snippet children(peer)}
						{#if peer.fields.$room != null}
							<div>
								<dt>Room session</dt>
								<dd>
									<BlockheadRoomView
										selector={peer.fields.$room[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if peer.fields.joinedAt != null}
							<div>
								<dt>Joined</dt>
								<dd>
									<Timestamp timestamp={peer.fields.joinedAt} />
								</dd>
							</div>
						{/if}

						{#if peer.fields.lastSeenAt != null}
							<div>
								<dt>Last seen</dt>
								<dd>
									<Timestamp timestamp={peer.fields.lastSeenAt} />
								</dd>
							</div>
						{/if}

						{#if peer.fields.connectedAt != null}
							<div>
								<dt>Connected</dt>
								<dd>
									<Timestamp timestamp={peer.fields.connectedAt} />
								</dd>
							</div>
						{/if}

						{#if peer.fields.disconnectedAt != null}
							<div>
								<dt>Disconnected</dt>
								<dd>
									<Timestamp timestamp={peer.fields.disconnectedAt} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
