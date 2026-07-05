<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBridgeIntent>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadBridgeIntent>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadBridgeIntent = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$sessionAction: true,
			amount: true,
			$fromNetwork: true,
			$toNetwork: true,
		},
	}))
	const titleFallback = $derived('blockhead bridge intent')
	const viewDomId = $derived('blockhead-bridge-intent-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentQuotesView from '$/views/BlockheadIntentQuotesView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBridgeIntent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadBridgeIntent}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.BlockheadSessionAction, false>('$sessionAction')}
				>
					{#snippet children(blockheadSessionAction)}
						<BlockheadSessionActionView
							selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
							prefetched={blockheadSessionAction}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.BlockheadSessionAction, false>('$sessionAction')}
				>
					{#snippet children(blockheadSessionAction)}
						<BlockheadSessionActionView
							selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
							prefetched={blockheadSessionAction}
							layout={EntityLayout.Title}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBridgeIntent}>
			{#snippet Pending()}
				{@const amount0 = prefetched.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amount0 = resolvedEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadBridgeIntent}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$fromNetwork')}
				>
					{#snippet children(network)}
						{#if network != null && network[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$toNetwork')}
				>
					{#snippet children(network)}
						{#if network != null && network[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$fromNetwork')}
				>
					{#snippet children(network)}
						{#if network != null && network[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$toNetwork')}
				>
					{#snippet children(network)}
						{#if network != null && network[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BlockheadSessionAction, false>('$sessionAction')}
					>
						{#snippet children(blockheadSessionAction)}
							{#if blockheadSessionAction[EntityMetaKey.Selector] != null}
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromNetworkCaip2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromNetworkCaip2 = prefetched.fromNetworkCaip2}
					{#if fromNetworkCaip2 !== undefined && fromNetworkCaip2 !== null}
						<div>
							<dt>from network CAIP-2</dt>
							<dd>
								<TruncatedValue value={fromNetworkCaip2 == null ? '' : String((`${(fromNetworkCaip2).namespace}:${(fromNetworkCaip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromNetworkCaip2 = resolvedEntity.fromNetworkCaip2}
					{#if fromNetworkCaip2 !== undefined && fromNetworkCaip2 !== null}
						<div>
							<dt>from network CAIP-2</dt>
							<dd>
								<TruncatedValue value={fromNetworkCaip2 == null ? '' : String((`${(fromNetworkCaip2).namespace}:${(fromNetworkCaip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toNetworkCaip2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toNetworkCaip2 = prefetched.toNetworkCaip2}
					{#if toNetworkCaip2 !== undefined && toNetworkCaip2 !== null}
						<div>
							<dt>to network CAIP-2</dt>
							<dd>
								<TruncatedValue value={toNetworkCaip2 == null ? '' : String((`${(toNetworkCaip2).namespace}:${(toNetworkCaip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toNetworkCaip2 = resolvedEntity.toNetworkCaip2}
					{#if toNetworkCaip2 !== undefined && toNetworkCaip2 !== null}
						<div>
							<dt>to network CAIP-2</dt>
							<dd>
								<TruncatedValue value={toNetworkCaip2 == null ? '' : String((`${(toNetworkCaip2).namespace}:${(toNetworkCaip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetCaip19: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetCaip19 = prefetched.assetCaip19}
					{#if assetCaip19 !== undefined && assetCaip19 !== null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{String((assetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetCaip19 = resolvedEntity.assetCaip19}
					{#if assetCaip19 !== undefined && assetCaip19 !== null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{String((assetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAssetCaip19: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromAssetCaip19 = prefetched.fromAssetCaip19}
					{#if fromAssetCaip19 !== undefined && fromAssetCaip19 !== null}
						<div>
							<dt>from asset CAIP-19</dt>
							<dd>
								{String((fromAssetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromAssetCaip19 = resolvedEntity.fromAssetCaip19}
					{#if fromAssetCaip19 !== undefined && fromAssetCaip19 !== null}
						<div>
							<dt>from asset CAIP-19</dt>
							<dd>
								{String((fromAssetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAssetCaip19: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toAssetCaip19 = prefetched.toAssetCaip19}
					{#if toAssetCaip19 !== undefined && toAssetCaip19 !== null}
						<div>
							<dt>to asset CAIP-19</dt>
							<dd>
								{String((toAssetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAssetCaip19 = resolvedEntity.toAssetCaip19}
					{#if toAssetCaip19 !== undefined && toAssetCaip19 !== null}
						<div>
							<dt>to asset CAIP-19</dt>
							<dd>
								{String((toAssetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromChainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromChainId = prefetched.fromChainId}
					{#if fromChainId !== undefined && fromChainId !== null}
						<div>
							<dt>from chain ID</dt>
							<dd>
								<NumberValue value={Number(fromChainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromChainId = resolvedEntity.fromChainId}
					{#if fromChainId !== undefined && fromChainId !== null}
						<div>
							<dt>from chain ID</dt>
							<dd>
								<NumberValue value={Number(fromChainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toChainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toChainId = prefetched.toChainId}
					{#if toChainId !== undefined && toChainId !== null}
						<div>
							<dt>to chain ID</dt>
							<dd>
								<NumberValue value={Number(toChainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toChainId = resolvedEntity.toChainId}
					{#if toChainId !== undefined && toChainId !== null}
						<div>
							<dt>to chain ID</dt>
							<dd>
								<NumberValue value={Number(toChainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const coinId = prefetched.coinId}
					{#if coinId !== undefined && coinId !== null}
						<div>
							<dt>coin ID</dt>
							<dd>
								{String((coinId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinId = resolvedEntity.coinId}
					{#if coinId !== undefined && coinId !== null}
						<div>
							<dt>coin ID</dt>
							<dd>
								{String((coinId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromTokenAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromTokenAddress = prefetched.fromTokenAddress}
					{#if fromTokenAddress !== undefined && fromTokenAddress !== null}
						<div>
							<dt>from token address</dt>
							<dd>
								<TruncatedValue value={String((fromTokenAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromTokenAddress = resolvedEntity.fromTokenAddress}
					{#if fromTokenAddress !== undefined && fromTokenAddress !== null}
						<div>
							<dt>from token address</dt>
							<dd>
								<TruncatedValue value={String((fromTokenAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toTokenAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const toTokenAddress = prefetched.toTokenAddress}
					{#if toTokenAddress !== undefined && toTokenAddress !== null}
						<div>
							<dt>to token address</dt>
							<dd>
								<TruncatedValue value={String((toTokenAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toTokenAddress = resolvedEntity.toTokenAddress}
					{#if toTokenAddress !== undefined && toTokenAddress !== null}
						<div>
							<dt>to token address</dt>
							<dd>
								<TruncatedValue value={String((toTokenAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Network, false>('$fromNetwork')}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>from network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Network, false>('$toNetwork')}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>to network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2 !== undefined && ({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.namespace ?? '')}:${String(({ ...network[EntityMetaKey.Selector], ...network }).caip2.reference ?? '')}`,
										}) : ({ ...network[EntityMetaKey.Selector], ...network }).slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(({ ...network[EntityMetaKey.Selector], ...network }).slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$fromEvmNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>from EVM network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									href={
										(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2 !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.namespace !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2 !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.namespace ?? '')}:${String(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$toEvmNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>to EVM network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									href={
										(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2 !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.namespace !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2 !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.namespace ?? '')}:${String(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$fromToken')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>from token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2 !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2.reference !== undefined && (({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type !== undefined && (({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type === 'NativeCurrency' ? true : ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2.reference ?? ''),
											coinInstanceSlug: String((({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type === 'NativeCurrency' ? 'native' : ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract.address)),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$toToken')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>to token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2 !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2.reference !== undefined && (({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type !== undefined && (({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type === 'NativeCurrency' ? true : ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2.reference ?? ''),
											coinInstanceSlug: String((({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type === 'NativeCurrency' ? 'native' : ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract.address)),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amount = prefetched.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue value={Number(amount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue value={Number(amount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slippage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slippage = prefetched.slippage}
					{#if slippage !== undefined && slippage !== null}
						<div>
							<dt>slippage</dt>
							<dd>
								<NumberValue value={Number(slippage)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slippage = resolvedEntity.slippage}
					{#if slippage !== undefined && slippage !== null}
						<div>
							<dt>slippage</dt>
							<dd>
								<NumberValue value={Number(slippage)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadIntentQuotesView
				selection={selection[EntityProxyField]<EntityType.BlockheadIntentQuote>('$$quotes')}
				title='quotes'
				emptyText='No quotes.'
				id='BlockheadIntentQuotesView-$$quotes'
			/>
		{/if}
	{/snippet}
</EntityView>
