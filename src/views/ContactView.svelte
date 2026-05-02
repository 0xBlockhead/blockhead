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

	const isHexPrefixedAddress = (s: string): s is `0x${string}` => (
		s.startsWith('0x')
	)

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

	const sharedFieldBag = $derived(
		(() => {
			const bag = sharedRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object' || Array.isArray(bag)) return null
			return bag as Record<string, unknown>
		})(),
	)

	const peerId = $derived(
		(() => {
			const v = sharedFieldBag?.peerId
			return typeof v === 'string' && v.length ? v : undefined
		})(),
	)

	const targetPeerIds = $derived(
		(() => {
			const v = sharedFieldBag?.targetPeerIds
			if (v === undefined) return null
			if (!Array.isArray(v)) return null
			const strings = v.filter((x): x is string => typeof x === 'string' && x.length > 0)
			return strings.length ? strings : null
		})(),
	)

	const sharedAt = $derived(
		(() => {
			const v = sharedFieldBag?.sharedAt
			return typeof v === 'number' && Number.isFinite(v) ? v : undefined
		})(),
	)

	const roomId = $derived(
		(() => {
			const room = sharedFieldBag?.$room
			if (room === undefined || typeof room !== 'object' || Array.isArray(room)) return undefined
			const id = (room as { id: unknown }).id
			return typeof id === 'string' && id.length ? id : undefined
		})(),
	)

	const networkChainId = $derived(
		(() => {
			const net = sharedFieldBag?.$network
			if (net === undefined || typeof net !== 'object' || Array.isArray(net)) return undefined
			const chainId = (net as { chainId: unknown }).chainId
			return typeof chainId === 'number' ? chainId : undefined
		})(),
	)

	const accountForAddress = $derived(
		(() => {
			const acc = sharedFieldBag?.$account
			if (acc === undefined || typeof acc !== 'object' || Array.isArray(acc)) return null
			const accRec = acc as { $network: unknown, address: unknown }
			const net = accRec.$network
			const addr = accRec.address
			if (
				net === undefined
				|| typeof net !== 'object'
				|| Array.isArray(net)
				|| typeof addr !== 'string'
				|| !isHexPrefixedAddress(addr)
			) return null
			const chainId = (net as { chainId: unknown }).chainId
			if (typeof chainId !== 'number') return null
			return (
				{
					$network: { chainId },
					address: addr,
				} satisfies EntityId<typeof schema, EntityType.Actor>
			)
		})(),
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
		<dl data-definition-list="vertical">
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
							{#if targetPeerIds !== undefined}
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
