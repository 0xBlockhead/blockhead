<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { bridgeRouteTagByTag } from '$/constants/Bridge.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BridgeRouteQuote_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BridgeRouteQuote_Timestamp>
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
	const bridgeRouteQuoteTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			fromChainId: true,
			toChainId: true,
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			fromChainId: true,
			toChainId: true,
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route quote timestamp')
	const viewDomId = $derived('bridge-route-quote-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'fromChainId') && Object.hasOwn(prefetched, 'toChainId') && Object.hasOwn(prefetched, 'estimatedCostUsd') && Object.hasOwn(prefetched, 'estimatedDurationSeconds')}
			{[String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.fromChainId) ?? ''), 'to', String((resolvedEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'fromChainId') && Object.hasOwn(prefetched, 'toChainId') && Object.hasOwn(prefetched, 'estimatedCostUsd') && Object.hasOwn(prefetched, 'estimatedDurationSeconds')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'fromChainId') && Object.hasOwn(prefetched, 'toChainId') && Object.hasOwn(prefetched, 'estimatedCostUsd') && Object.hasOwn(prefetched, 'estimatedDurationSeconds')}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
			{@const estimatedCostUsd1 = pendingEntity.estimatedCostUsd}
			{#if estimatedCostUsd1 !== undefined && estimatedCostUsd1 !== null}
				<span data-text="muted">
					{String((estimatedCostUsd1) ?? '')}
				</span>
			{/if}
			{@const estimatedDurationSeconds2 = pendingEntity.estimatedDurationSeconds}
			{#if estimatedDurationSeconds2 !== undefined && estimatedDurationSeconds2 !== null}
				<span data-text="muted">
					{String((estimatedDurationSeconds2) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
					{@const estimatedCostUsd1 = resolvedEntity.estimatedCostUsd}
					{#if estimatedCostUsd1 !== undefined && estimatedCostUsd1 !== null}
						<span data-text="muted">
							{String((estimatedCostUsd1) ?? '')}
						</span>
					{/if}
					{@const estimatedDurationSeconds2 = resolvedEntity.estimatedDurationSeconds}
					{#if estimatedDurationSeconds2 !== undefined && estimatedDurationSeconds2 !== null}
						<span data-text="muted">
							{String((estimatedDurationSeconds2) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$fromNetwork}
					>
						{#snippet children(network)}
							{#if network != null && network[EntityMetaKey.Selector] != null}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(
											network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
											&& network[EntityMetaKey.Selector].caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										})
										:
												network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
												&& network[EntityMetaKey.Selector].slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]', {
												network: String(network[EntityMetaKey.Selector].slug ?? ''),
											})
											:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
							{#if network != null && network[EntityMetaKey.Selector] != null}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(
											network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
											&& network[EntityMetaKey.Selector].caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										})
										:
												network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
												&& network[EntityMetaKey.Selector].slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]', {
												network: String(network[EntityMetaKey.Selector].slug ?? ''),
											})
											:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
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
								sources: selection.sources,
								fields: {
									fromToken: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fromToken = resolvedEntity.fromToken}
							{#if fromToken !== undefined && fromToken !== null}
								<TruncatedValue value={String((fromToken) ?? '')} />
							{/if}
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
								sources: selection.sources,
								fields: {
									toToken: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toToken = resolvedEntity.toToken}
							{#if toToken !== undefined && toToken !== null}
								<TruncatedValue value={String((toToken) ?? '')} />
							{/if}
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
								sources: selection.sources,
								fields: {
									fromAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fromAddress = resolvedEntity.fromAddress}
							{#if fromAddress !== undefined && fromAddress !== null}
								<TruncatedValue value={String(fromAddress)} />
							{/if}
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
								sources: selection.sources,
								fields: {
									toAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toAddress = resolvedEntity.toAddress}
							{#if toAddress !== undefined && toAddress !== null}
								<TruncatedValue value={String(toAddress)} />
							{/if}
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
								sources: selection.sources,
								fields: {
									fromAmount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fromAmount = resolvedEntity.fromAmount}
							{#if fromAmount !== undefined && fromAmount !== null}
								<NumberValue
									value={fromAmount}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							toAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAmount = resolvedEntity.toAmount}
					{#if toAmount !== undefined && toAmount !== null}
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
						sources: selection.sources,
						fields: {
							toAmountMin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAmountMin = resolvedEntity.toAmountMin}
					{#if toAmountMin !== undefined && toAmountMin !== null}
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
								sources: selection.sources,
								fields: {
									slippage: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slippage = resolvedEntity.slippage}
							{#if slippage !== undefined && slippage !== null}
								{String((slippage) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							estimatedCostUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const estimatedCostUsd = resolvedEntity.estimatedCostUsd}
					{#if estimatedCostUsd !== undefined && estimatedCostUsd !== null}
						<div>
							<dt>estimated cost usd</dt>
							<dd>
								{String((estimatedCostUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							estimatedDurationSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const estimatedDurationSeconds = resolvedEntity.estimatedDurationSeconds}
					{#if estimatedDurationSeconds !== undefined && estimatedDurationSeconds !== null}
						<div>
							<dt>estimated duration seconds</dt>
							<dd>
								{String((estimatedDurationSeconds) ?? '')}
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
						sources: selection.sources,
						fields: {
							providerQuoteId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerQuoteId = resolvedEntity.providerQuoteId}
					{#if providerQuoteId !== undefined && providerQuoteId !== null}
						<div>
							<dt>provider quote ID</dt>
							<dd>
								{String((providerQuoteId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>quote request hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									quoteRequestHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quoteRequestHash = resolvedEntity.quoteRequestHash}
							{#if quoteRequestHash !== undefined && quoteRequestHash !== null}
								<TruncatedValue value={String((quoteRequestHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							approvalAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const approvalAddress = resolvedEntity.approvalAddress}
					{#if approvalAddress !== undefined && approvalAddress !== null}
						<div>
							<dt>approval address</dt>
							<dd>
								<TruncatedValue value={String((approvalAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transactionTo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionTo = resolvedEntity.transactionTo}
					{#if transactionTo !== undefined && transactionTo !== null}
						<div>
							<dt>transaction to</dt>
							<dd>
								{String((transactionTo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transactionDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionDataHash = resolvedEntity.transactionDataHash}
					{#if transactionDataHash !== undefined && transactionDataHash !== null}
						<div>
							<dt>transaction data hash</dt>
							<dd>
								<TruncatedValue value={String((transactionDataHash) ?? '')} />
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
								sources: selection.sources,
								fields: {
									tags: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const tags = resolvedEntity.tags}
							{#if tags !== undefined && tags !== null}
								{tags == null ? '' : String(((tags).map((tag) => bridgeRouteTagByTag[tag].label).join(', ')) ?? '')}
							{/if}
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
					id='BridgeRouteQuoteStepsView-steps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
