<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BridgeRouteQuote_Timestamp>>
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
	const bridgeRouteQuoteTimestamp = $derived(selection({
		fields: {
			fromChainId: true,
			toChainId: true,
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route quote timestamp')
	const viewDomId = $derived('bridge-route-quote-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route quote timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.fromChainId) ?? ''), 'to', String((resolvedEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteQuoteTimestamp}>
			{#snippet Pending()}
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
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
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
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
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
								fields: {
									fromToken: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fromToken = pendingEntity.fromToken}
							{#if fromToken !== undefined && fromToken !== null}
								<TruncatedValue value={String((fromToken) ?? '')} />
							{/if}
						{/snippet}

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
								fields: {
									toToken: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toToken = pendingEntity.toToken}
							{#if toToken !== undefined && toToken !== null}
								<TruncatedValue value={String((toToken) ?? '')} />
							{/if}
						{/snippet}

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
								fields: {
									fromAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fromAddress = pendingEntity.fromAddress}
							{#if fromAddress !== undefined && fromAddress !== null}
								<TruncatedValue value={String(fromAddress)} />
							{/if}
						{/snippet}

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
								fields: {
									toAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toAddress = pendingEntity.toAddress}
							{#if toAddress !== undefined && toAddress !== null}
								<TruncatedValue value={String(toAddress)} />
							{/if}
						{/snippet}

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
								fields: {
									fromAmount: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const fromAmount = pendingEntity.fromAmount}
							{#if fromAmount !== undefined && fromAmount !== null}
								<NumberValue value={Number(fromAmount)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const fromAmount = resolvedEntity.fromAmount}
							{#if fromAmount !== undefined && fromAmount !== null}
								<NumberValue value={Number(fromAmount)} />
							{/if}
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
				{#snippet Pending()}
					{@const toAmount = pendingEntity.toAmount}
					{#if toAmount !== undefined && toAmount !== null}
						<div>
							<dt>to amount</dt>
							<dd>
								<NumberValue value={Number(toAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAmount = resolvedEntity.toAmount}
					{#if toAmount !== undefined && toAmount !== null}
						<div>
							<dt>to amount</dt>
							<dd>
								<NumberValue value={Number(toAmount)} />
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
				{#snippet Pending()}
					{@const toAmountMin = pendingEntity.toAmountMin}
					{#if toAmountMin !== undefined && toAmountMin !== null}
						<div>
							<dt>to amount min</dt>
							<dd>
								<NumberValue value={Number(toAmountMin)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAmountMin = resolvedEntity.toAmountMin}
					{#if toAmountMin !== undefined && toAmountMin !== null}
						<div>
							<dt>to amount min</dt>
							<dd>
								<NumberValue value={Number(toAmountMin)} />
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
						{#snippet Pending()}
							{@const slippage = pendingEntity.slippage}
							{#if slippage !== undefined && slippage !== null}
								{String((slippage) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							estimatedCostUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const estimatedCostUsd = pendingEntity.estimatedCostUsd}
					{#if estimatedCostUsd !== undefined && estimatedCostUsd !== null}
						<div>
							<dt>estimated cost usd</dt>
							<dd>
								{String((estimatedCostUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							estimatedDurationSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const estimatedDurationSeconds = pendingEntity.estimatedDurationSeconds}
					{#if estimatedDurationSeconds !== undefined && estimatedDurationSeconds !== null}
						<div>
							<dt>estimated duration seconds</dt>
							<dd>
								{String((estimatedDurationSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerQuoteId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerQuoteId = pendingEntity.providerQuoteId}
					{#if providerQuoteId !== undefined && providerQuoteId !== null}
						<div>
							<dt>provider quote ID</dt>
							<dd>
								{String((providerQuoteId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									quoteRequestHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const quoteRequestHash = pendingEntity.quoteRequestHash}
							{#if quoteRequestHash !== undefined && quoteRequestHash !== null}
								<TruncatedValue value={String((quoteRequestHash) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							approvalAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const approvalAddress = pendingEntity.approvalAddress}
					{#if approvalAddress !== undefined && approvalAddress !== null}
						<div>
							<dt>approval address</dt>
							<dd>
								<TruncatedValue value={String((approvalAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							transactionTo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionTo = pendingEntity.transactionTo}
					{#if transactionTo !== undefined && transactionTo !== null}
						<div>
							<dt>transaction to</dt>
							<dd>
								{String((transactionTo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							transactionDataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionDataHash = pendingEntity.transactionDataHash}
					{#if transactionDataHash !== undefined && transactionDataHash !== null}
						<div>
							<dt>transaction data hash</dt>
							<dd>
								<TruncatedValue value={String((transactionDataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
								fields: {
									tags: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const tags = pendingEntity.tags}
							{#if tags !== undefined && tags !== null}
								{tags == null ? '' : String(((tags).map((tag) => bridgeRouteTagByTag[tag].label).join(', ')) ?? '')}
							{/if}
						{/snippet}

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
		{#if detailsOpen}
			<BridgeRouteQuoteStepsView
				selection={
						selection.$$steps({
							count: true,
						})
					}
				title='Steps'
				emptyText='No steps on this route quote.'
				id='BridgeRouteQuoteStepsView-steps'
			/>
		{/if}
	{/snippet}
</EntityView>
