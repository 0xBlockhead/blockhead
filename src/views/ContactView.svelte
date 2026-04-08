<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			| 'Summary'
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
			if (bag == null || typeof bag !== 'object' || Array.isArray(bag)) return null
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
			if (v == null) return null
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
			if (room == null || typeof room !== 'object' || Array.isArray(room)) return undefined
			const id = Reflect.get(room, 'id')
			return typeof id === 'string' && id.length ? id : undefined
		})(),
	)

	const networkChainId = $derived(
		(() => {
			const net = sharedFieldBag?.$network
			if (net == null || typeof net !== 'object' || Array.isArray(net)) return undefined
			const chainId = Reflect.get(net, 'chainId')
			return typeof chainId === 'number' ? chainId : undefined
		})(),
	)

	const accountForAddress = $derived(
		(() => {
			const acc = sharedFieldBag?.$account
			if (acc == null || typeof acc !== 'object' || Array.isArray(acc)) return null
			const net = Reflect.get(acc, '$network')
			const addr = Reflect.get(acc, 'address')
			if (
				net == null
				|| typeof net !== 'object'
				|| Array.isArray(net)
				|| typeof addr !== 'string'
				|| !isHexPrefixedAddress(addr)
			) return null
			const chainId = Reflect.get(net, 'chainId')
			if (typeof chainId !== 'number') return null
			return (
				{
					$network: { chainId },
					address: addr,
				} satisfies EntityId<typeof schema, EntityType.Actor>
			)
		})(),
	)

	const displayTitle = $derived(
		peerId ?? entityId.id,
	)


	// Components
	import Address from '$/views/Address.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	{entityId}
	title={titleProp ?? displayTitle}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Contact ID</dt>
				<dd>{entityId.id}</dd>
			</div>
			{#if peerId != null}
				<div>
					<dt>Peer ID</dt>
					<dd>{peerId}</dd>
				</div>
			{/if}
			{#if accountForAddress != null}
				<div>
					<dt>Account</dt>
					<dd>
						<Address
							actorId={accountForAddress}
						/>
					</dd>
				</div>
			{/if}
			{#if networkChainId != null}
				<div>
					<dt>Chain ID</dt>
					<dd>{String(networkChainId)}</dd>
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
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No contact row in collections yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Contact ID</dt>
								<dd>{entityId.id}</dd>
							</div>
							{#if peerId != null}
								<div>
									<dt>Peer ID</dt>
									<dd>{peerId}</dd>
								</div>
							{/if}
							{#if accountForAddress != null}
								<div>
									<dt>Account</dt>
									<dd>
										<Address
											actorId={accountForAddress}
										/>
									</dd>
								</div>
							{/if}
							{#if roomId != null}
								<div>
									<dt>Room</dt>
									<dd>{roomId}</dd>
								</div>
							{/if}
							{#if networkChainId != null}
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
							{#if sharedAt != null}
								<div>
									<dt>Shared at</dt>
									<dd>{String(sharedAt)}</dd>
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
