<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { bridgeRouteTagByTag } from '$/constants/Bridge.ts'
	import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BridgeRouteQuote_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const bridgeRouteQuoteTimestamp = $derived(selection({
		fields: {
			fromChainId: true,
			toChainId: true,
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	}))
	const titleFallback = $derived([String(pendingEntity.fromChainId ?? ''), 'to', String(pendingEntity.toChainId ?? '')].filter(Boolean).join(' ') || 'bridge route quote timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BridgeRouteQuoteStepsView from '$/views/BridgeRouteQuoteStepsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteQuote_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
			{#snippet children(entity)}
				{[String(entity.fromChainId), 'to', String(entity.toChainId)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{pendingEntity.source}
				</span>
				{@const estimatedCostUsd1 = entity.estimatedCostUsd}
				{#if estimatedCostUsd1 != null}
					<span data-text="muted">
						{String(estimatedCostUsd1)}
					</span>
				{/if}
				{@const estimatedDurationSeconds2 = entity.estimatedDurationSeconds}
				{#if estimatedDurationSeconds2 != null}
					<span data-text="muted">
						{String(estimatedDurationSeconds2)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>from network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$fromNetwork}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$toNetwork}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>from token</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fromToken: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.fromToken} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to token</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									toToken: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.toToken} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from address</dt>
				<dd>
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
							<TruncatedValue value={String(entity.fromAddress)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to address</dt>
				<dd>
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
							<TruncatedValue value={String(entity.toAddress)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									fromAmount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.fromAmount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAmount = entity.toAmount}
					{#if toAmount != null}
						<div>
							<dt>to amount</dt>
							<dd>
								<NumberValue
									value={toAmount}
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
							toAmountMin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAmountMin = entity.toAmountMin}
					{#if toAmountMin != null}
						<div>
							<dt>to amount min</dt>
							<dd>
								<NumberValue
									value={toAmountMin}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>slippage</dt>
				<dd>
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
							{String(entity.slippage)}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={bridgeRouteQuoteTimestamp}
			>
				{#snippet children(entity)}
					{@const estimatedCostUsd = entity.estimatedCostUsd}
					{#if estimatedCostUsd != null}
						<div>
							<dt>estimated cost usd</dt>
							<dd>
								{String(estimatedCostUsd)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bridgeRouteQuoteTimestamp}
			>
				{#snippet children(entity)}
					{@const estimatedDurationSeconds = entity.estimatedDurationSeconds}
					{#if estimatedDurationSeconds != null}
						<div>
							<dt>estimated duration seconds</dt>
							<dd>
								{String(estimatedDurationSeconds)}
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

			<div>
				<dt>quote request hash</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.quoteRequestHash)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							approvalAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const approvalAddress = entity.approvalAddress}
					{#if approvalAddress != null}
						<div>
							<dt>approval address</dt>
							<dd>
								<TruncatedValue value={String(approvalAddress)} />
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
								{String(transactionTo)}
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
								<TruncatedValue value={String(transactionDataHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>tags</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									tags: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.tags.map((tag) => bridgeRouteTagByTag[tag].label).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const bridgeRouteQuoteTimestampBridgeRouteQuoteStepsViewStepsResource = selection.$$steps}
		<ResourceBoundary
			resource={bridgeRouteQuoteTimestampBridgeRouteQuoteStepsViewStepsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BridgeRouteQuoteStepsView
						selection={bridgeRouteQuoteTimestampBridgeRouteQuoteStepsViewStepsResource}
						countResource={bridgeRouteQuoteTimestampBridgeRouteQuoteStepsViewStepsResource.count}
						title='Steps'
						id='steps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
