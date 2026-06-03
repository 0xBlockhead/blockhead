	<script lang="ts">
	// Types/constants
		import type { ComponentProps, Snippet } from 'svelte'
		import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
		import { EntityType } from '$/schema/$EntityType.ts'
		import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
			entityId,
			href = resolve(
				'/~/(multiplayer)/multiplayer/(contacts)/contact/[contactId]',
				{
					contactId: entityId.id,
				},
			),
		title: titleProp,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BlockheadRoomPeer>
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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	{entityId}
	href={href}
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
						{#if peer.$room?.id != null && peer.$room.id !== ''}
							<div>
								<dt>Room session</dt>
								<dd>
									{peer.$room[EntityMetaKey.Id].id}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
