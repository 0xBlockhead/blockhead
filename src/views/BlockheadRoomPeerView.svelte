	<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
		import type { ComponentProps } from 'svelte'
		import { EntityMetaKey } from '$/schema/$schema.ts'
		import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
			selection,
			href,
		title: titleProp,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRoomPeer>
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


	const peer = $derived(selection( { sources: [
				Source.Local_Internal,
			], fields: { displayName: true, isConnected: true, ...(open ? ({ $room: true, peerId: true, joinedAt: true, lastSeenAt: true, connectedAt: true, disconnectedAt: true }) : ({  })) } }))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	entitySelector={selection.entitySelector}
	href={href ?? resolve(
		'/~/(multiplayer)/multiplayer/(contacts)/contact/[contactId]',
		{
			contactId: selection.entitySelector.id,
		},
	)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={peer}
			placeholderText="Loading peer…"
		>
			{#snippet children(peer)}
				{titleProp ?? peer.displayName ?? peer.peerId ?? selection.entitySelector.id}
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

				<ResourceBoundary resource={peer}>
					{#snippet children(peer)}
						{#if peer.peerId !== undefined && peer.peerId !== ''}
							<div>
								<dt>libp2p peer ID</dt>
								<dd>
									{peer.peerId}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary resource={peer}>
					{#snippet children(peer)}
						{#if peer.$room != null}
							<div>
								<dt>Room session</dt>
								<dd>
									<BlockheadRoomView
										selection={select(EntityType.BlockheadRoom, peer.$room[EntityMetaKey.Selector])}
										layout={EntityLayout.Title}

										open={false}
										/>
								</dd>
							</div>
						{/if}

						{#if peer.joinedAt != null}
							<div>
								<dt>Joined</dt>
								<dd>
									<Timestamp timestamp={peer.joinedAt} />
								</dd>
							</div>
						{/if}

						{#if peer.lastSeenAt != null}
							<div>
								<dt>Last seen</dt>
								<dd>
									<Timestamp timestamp={peer.lastSeenAt} />
								</dd>
							</div>
						{/if}

						{#if peer.connectedAt != null}
							<div>
								<dt>Connected</dt>
								<dd>
									<Timestamp timestamp={peer.connectedAt} />
								</dd>
							</div>
						{/if}

						{#if peer.disconnectedAt != null}
							<div>
								<dt>Disconnected</dt>
								<dd>
									<Timestamp timestamp={peer.disconnectedAt} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
