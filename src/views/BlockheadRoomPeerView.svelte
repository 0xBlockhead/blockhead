<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
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
		>
	> = $props()


	const peerRowIdKey = $derived(
		stringify(entityId),
	)

	const peerQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadRoomPeer] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						peerRowIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => peerRowIdKey],
	)

	const peerRow = $derived(
		peerQuery.data?.[0]?.row,
	)

	const peerFields = $derived(
		((u) => (
			typeof u === 'object' && u !== null && !Array.isArray(u) ?
				u
			:	null
		))(peerRow?.[EntityMetaKey.Fields]),
	)

	const peerId = $derived(
		typeof peerFields?.peerId === 'string' && peerFields.peerId.length ?
			peerFields.peerId
		:	undefined,
	)

	const displayName = $derived(
		typeof peerFields?.displayName === 'string' && peerFields.displayName.length ?
			peerFields.displayName
		:	undefined,
	)

	const joinedAt = $derived(
		typeof peerFields?.joinedAt === 'number' && Number.isFinite(peerFields.joinedAt) ?
			peerFields.joinedAt
		:	undefined,
	)

	const lastSeenAt = $derived(
		typeof peerFields?.lastSeenAt === 'number' && Number.isFinite(peerFields.lastSeenAt) ?
			peerFields.lastSeenAt
		:	undefined,
	)

	const connectedAt = $derived(
		typeof peerFields?.connectedAt === 'number' && Number.isFinite(peerFields.connectedAt) ?
			peerFields.connectedAt
		:	undefined,
	)

	const disconnectedAt = $derived(
		typeof peerFields?.disconnectedAt === 'number' && Number.isFinite(peerFields.disconnectedAt) ?
			peerFields.disconnectedAt
		:	undefined,
	)

	const isConnected = $derived(
		typeof peerFields?.isConnected === 'boolean' ?
			peerFields.isConnected
		:	undefined,
	)

	const roomId = $derived(
		!(
			typeof peerFields?.$room === 'object'
			&& peerFields.$room !== null
			&& !Array.isArray(peerFields.$room)
		) ?
			undefined
		: ((
			id,
		) => (
			typeof id === 'string' && id.length ?
				id
			:	undefined
		))(
			'id' in peerFields.$room ? peerFields.$room.id : undefined,
		),
	)

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRoomPeer}
	{entityId}
	title={titleProp ?? (displayName ?? peerId ?? entityId.id)}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Contact ID</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if peerId !== undefined}
				<div>
					<dt>Peer ID</dt>
					<dd>{peerId}</dd>
				</div>
			{/if}
			{#if isConnected !== undefined}
				<div>
					<dt>Connected</dt>
					<dd>{isConnected ? 'Yes' : 'No'}</dd>
				</div>
			{/if}
			{#if roomId !== undefined}
				<div>
					<dt>Room</dt>
					<dd>{roomId}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadRoomPeer}
				{entityId}
			>
				<QueryBoundary
					query={peerQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No room peer data yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Contact ID</dt>
								<dd>{entityId.id}</dd>
							</div>
							{#if peerId !== undefined}
								<div>
									<dt>Peer ID</dt>
									<dd>{peerId}</dd>
								</div>
							{/if}
							{#if displayName !== undefined}
								<div>
									<dt>Display name</dt>
									<dd>{displayName}</dd>
								</div>
							{/if}
							{#if roomId !== undefined}
								<div>
									<dt>Room</dt>
									<dd>{roomId}</dd>
								</div>
							{/if}
							{#if joinedAt !== undefined}
								<div>
									<dt>Joined at</dt>
									<dd>{String(joinedAt)}</dd>
								</div>
							{/if}
							{#if lastSeenAt !== undefined}
								<div>
									<dt>Last seen at</dt>
									<dd>{String(lastSeenAt)}</dd>
								</div>
							{/if}
							{#if connectedAt !== undefined}
								<div>
									<dt>Connected at</dt>
									<dd>{String(connectedAt)}</dd>
								</div>
							{/if}
							{#if disconnectedAt !== undefined}
								<div>
									<dt>Disconnected at</dt>
									<dd>{String(disconnectedAt)}</dd>
								</div>
							{/if}
							{#if isConnected !== undefined}
								<div>
									<dt>Is connected</dt>
									<dd>{isConnected ? 'Yes' : 'No'}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
