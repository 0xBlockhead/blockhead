<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadBridgeIntent>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadBridgeIntent = $derived(viewSelection({
		fields: {
			amount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentQuotesView from '$/views/BlockheadIntentQuotesView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadBridgeIntent}
	entitySelector={selection.entitySelector}
	title={title ?? 'blockhead bridge intent'}
	href={
		href === undefined ?
			resolve(
				'/~/session/[sessionId=stringSegment]/(blockheadSession)/bridge-intent/[actionId=stringSegment]',
				{
					sessionId: selection.entitySelector.sessionId,
					actionId: selection.entitySelector.actionId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$sessionAction}
		>
			{#snippet children(blockheadSessionAction)}
				<BlockheadSessionActionView
					selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
					prefetched={blockheadSessionAction}
					href={null}
					layout={EntityLayout.Title}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadBridgeIntent}>
			{#snippet children(entity)}
				{@const amount = entity.amount}
				{#if amount != null}
					<NumberValue
						value={amount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$fromNetwork}
		>
			{#snippet children(network)}
				{#if network != null}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
							prefetched={network}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$toNetwork}
		>
			{#snippet children(network)}
				{#if network != null}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
							prefetched={network}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$sessionAction}
					>
						{#snippet children(blockheadSessionAction)}
							<BlockheadSessionActionView
								selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
								prefetched={blockheadSessionAction}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromNetworkCaip2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromNetworkCaip2 = entity.fromNetworkCaip2}
					{#if fromNetworkCaip2 != null}
						<div>
							<dt>from network CAIP-2</dt>
							<dd>
								<TruncatedValue value={`${fromNetworkCaip2.namespace}:${fromNetworkCaip2.reference}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toNetworkCaip2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toNetworkCaip2 = entity.toNetworkCaip2}
					{#if toNetworkCaip2 != null}
						<div>
							<dt>to network CAIP-2</dt>
							<dd>
								<TruncatedValue value={`${toNetworkCaip2.namespace}:${toNetworkCaip2.reference}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetCaip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetCaip19 = entity.assetCaip19}
					{#if assetCaip19 != null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{assetCaip19}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromAssetCaip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAssetCaip19 = entity.fromAssetCaip19}
					{#if fromAssetCaip19 != null}
						<div>
							<dt>from asset CAIP-19</dt>
							<dd>
								{fromAssetCaip19}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toAssetCaip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAssetCaip19 = entity.toAssetCaip19}
					{#if toAssetCaip19 != null}
						<div>
							<dt>to asset CAIP-19</dt>
							<dd>
								{toAssetCaip19}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromChainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromChainId = entity.fromChainId}
					{#if fromChainId != null}
						<div>
							<dt>from chain ID</dt>
							<dd>
								<NumberValue
									value={fromChainId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toChainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toChainId = entity.toChainId}
					{#if toChainId != null}
						<div>
							<dt>to chain ID</dt>
							<dd>
								<NumberValue
									value={toChainId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							coinId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinId = entity.coinId}
					{#if coinId != null}
						<div>
							<dt>coin ID</dt>
							<dd>
								{coinId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromTokenAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromTokenAddress = entity.fromTokenAddress}
					{#if fromTokenAddress != null}
						<div>
							<dt>from token address</dt>
							<dd>
								<TruncatedValue value={fromTokenAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toTokenAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toTokenAddress = entity.toTokenAddress}
					{#if toTokenAddress != null}
						<div>
							<dt>to token address</dt>
							<dd>
								<TruncatedValue value={toTokenAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$fromNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>from network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>to network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromEvmNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>from EVM network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toEvmNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>to EVM network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>from token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>to token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadBridgeIntent}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							slippage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slippage = entity.slippage}
					{#if slippage != null}
						<div>
							<dt>slippage</dt>
							<dd>
								<NumberValue
									value={slippage}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const quotesResource = selection.$$quotes}
		<ResourceBoundary
			resource={quotesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadIntentQuotesView
						selection={quotesResource}
						countResource={quotesResource.count}
						title='quotes'
						id='quotes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
