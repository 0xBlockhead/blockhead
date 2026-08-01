<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.SwapQuote_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BlockheadSwapIntentView from '$/views/BlockheadSwapIntentView.svelte'
</script>


<EntityView
	entityType={EntityType.SwapQuote_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>quote request hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.quoteRequestHash} />
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>token in</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tokenIn}
					>
						{#snippet children(evmCoinInstance)}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
								prefetched={evmCoinInstance}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>token out</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tokenOut}
					>
						{#snippet children(evmCoinInstance)}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
								prefetched={evmCoinInstance}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>amount in</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									amountIn: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.amountIn}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
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
								{slippage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAddress = entity.fromAddress}
					{#if fromAddress != null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={fromAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={toAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$intent}
			>
				{#snippet children(blockheadSwapIntent)}
					{#if blockheadSwapIntent != null}
						<div>
							<dt>intent</dt>
							<dd>
								<BlockheadSwapIntentView
									selection={select(EntityType.BlockheadSwapIntent, blockheadSwapIntent[EntityMetaKey.Selector])}
									prefetched={blockheadSwapIntent}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerQuoteId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerQuoteId = entity.providerQuoteId}
					{#if providerQuoteId != null}
						<div>
							<dt>provider quote ID</dt>
							<dd>
								{providerQuoteId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountOut: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountOut = entity.amountOut}
					{#if amountOut != null}
						<div>
							<dt>amount out</dt>
							<dd>
								{amountOut}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountOutMin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountOutMin = entity.amountOutMin}
					{#if amountOutMin != null}
						<div>
							<dt>amount out min</dt>
							<dd>
								{amountOutMin}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceImpact: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceImpact = entity.priceImpact}
					{#if priceImpact != null}
						<div>
							<dt>price impact</dt>
							<dd>
								{priceImpact}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							estimatedGas: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const estimatedGas = entity.estimatedGas}
					{#if estimatedGas != null}
						<div>
							<dt>estimated gas</dt>
							<dd>
								{estimatedGas}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							estimatedGasUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const estimatedGasUsd = entity.estimatedGasUsd}
					{#if estimatedGasUsd != null}
						<div>
							<dt>estimated gas usd</dt>
							<dd>
								{estimatedGasUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allowanceTarget: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allowanceTarget = entity.allowanceTarget}
					{#if allowanceTarget != null}
						<div>
							<dt>allowance target</dt>
							<dd>
								{allowanceTarget}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionTo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionTo = entity.transactionTo}
					{#if transactionTo != null}
						<div>
							<dt>transaction to</dt>
							<dd>
								{transactionTo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionDataHash = entity.transactionDataHash}
					{#if transactionDataHash != null}
						<div>
							<dt>transaction data hash</dt>
							<dd>
								<TruncatedValue value={transactionDataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validUntilMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validUntilMs = entity.validUntilMs}
					{#if validUntilMs != null}
						<div>
							<dt>valid until ms</dt>
							<dd>
								{validUntilMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								{blockNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
