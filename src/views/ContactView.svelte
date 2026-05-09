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
			entityId: EntityId<typeof schema, EntityType.BlockheadSharedAddress>
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

	const sharedAddressIdKey = $derived(
		stringify(entityId),
	)

	const sharedQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadSharedAddress] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						sharedAddressIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => sharedAddressIdKey],
	)

	const sharedRow = $derived(
		sharedQuery.data?.[0]?.row,
	)

	const sharedFields = $derived(
		((u) => (
			typeof u === 'object' && u !== null && !Array.isArray(u) ?
				u
			:	null
		))(sharedRow?.[EntityMetaKey.Fields]),
	)

	const peerId = $derived(
		typeof sharedFields?.peerId === 'string' && sharedFields.peerId.length ?
			sharedFields.peerId
		:	undefined,
	)

	const targetPeerIds = $derived(
		sharedFields?.targetPeerIds === undefined ?
			null
		: !Array.isArray(sharedFields.targetPeerIds) ?
			null
		: ((a) => (a.length ? a : null))(
			sharedFields.targetPeerIds.filter((x): x is string => typeof x === 'string' && x.length > 0),
		),
	)

	const sharedAt = $derived(
		typeof sharedFields?.sharedAt === 'number' && Number.isFinite(sharedFields.sharedAt) ?
			sharedFields.sharedAt
		:	undefined,
	)

	const roomId = $derived(
		!(
			typeof sharedFields?.$room === 'object'
			&& sharedFields.$room !== null
			&& !Array.isArray(sharedFields.$room)
		) ?
			undefined
		: ((
			id,
		) => (
			typeof id === 'string' && id.length ?
				id
			:	undefined
		))(
			'id' in sharedFields.$room ? sharedFields.$room.id : undefined,
		),
	)

	const networkChainId = $derived(
		!(
			typeof sharedFields?.$network === 'object'
			&& sharedFields.$network !== null
			&& !Array.isArray(sharedFields.$network)
		) ?
			undefined
		: ((
			chainId,
		) => (
			typeof chainId === 'number' ?
				chainId
			:	undefined
		))(
			'chainId' in sharedFields.$network ? sharedFields.$network.chainId : undefined,
		),
	)

	const accountForAddress = $derived(
		((accUnknown) => (
			!(typeof accUnknown === 'object' && accUnknown !== null && !Array.isArray(accUnknown)) ?
				null
			: !('$network' in accUnknown) || !('address' in accUnknown) ?
				null
			: ((net, addr) => (
				!(typeof net === 'object' && net !== null && !Array.isArray(net))
				|| typeof addr !== 'string'
				|| !addr.startsWith('0x')
				|| !('chainId' in net)
				|| typeof net.chainId !== 'number' ?
					null
				:	({
						$network: { chainId: net.chainId },
						address: addr as `0x${string}`,
					} satisfies EntityId<typeof schema, EntityType.Actor>)
			))(accUnknown['$network'], accUnknown['address'])
		))(sharedFields?.['$account']),
	)

	// Components
	import Address from '$/views/Address.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	{entityId}
	title={titleProp ?? (peerId ?? entityId.id)}
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
			{#if accountForAddress !== undefined}
				<div>
					<dt>Account</dt>
					<dd>
						<Address
							actorId={accountForAddress}
						/>
					</dd>
				</div>
			{/if}
			{#if sharedAt !== undefined}
				<div>
					<dt>Timestamp</dt>
					<dd>
						<Timestamp
							timestamp={sharedAt}
							format={TimestampFormat.Both}
						/>
					</dd>
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
				entityType={EntityType.BlockheadSharedAddress}
				{entityId}
			>
				<QueryBoundary
					query={sharedQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No contact data yet.
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
							{#if accountForAddress !== undefined}
								<div>
									<dt>Account</dt>
									<dd>
										<Address
											actorId={accountForAddress}
										/>
									</dd>
								</div>
							{/if}
							{#if roomId !== undefined}
								<div>
									<dt>Room</dt>
									<dd>{roomId}</dd>
								</div>
							{/if}
							{#if networkChainId !== undefined}
								<div>
									<dt>Network chain ID</dt>
									<dd>{String(networkChainId)}</dd>
								</div>
							{/if}
							{#if targetPeerIds != null}
								<div>
									<dt>Target peer IDs</dt>
									<dd>{targetPeerIds.join(', ')}</dd>
								</div>
							{/if}
							{#if sharedAt !== undefined}
								<div>
									<dt>Shared at</dt>
									<dd>
										<Timestamp
											timestamp={sharedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
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
