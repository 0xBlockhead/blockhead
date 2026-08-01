<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BridgeRouteQuoteStep>, 'prefetched'> = $props()

	const bridgeRouteQuoteStep = $derived(selection({
		fields: {
			tool: true,
			stepType: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteQuoteStep}
	entitySelector={selection.entitySelector}
	title={title ?? `Step #${selection.entitySelector.indexInQuote}`}
	idDragPlainText={String(selection.entitySelector.indexInQuote)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Step </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInQuote}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.indexInQuote}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteQuoteStep}>
			{#snippet children(entity)}
				{@const tool = entity.tool}
				{#if tool != null}
					<span data-text="muted">
						{tool}
					</span>
				{/if}
				{@const stepType = entity.stepType}
				{#if stepType != null}
					<span data-text="muted">
						{stepType}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>index in quote</dt>
				<dd>
					{selection.entitySelector.indexInQuote}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerStepId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerStepId = entity.providerStepId}
					{#if providerStepId != null}
						<div>
							<dt>provider step ID</dt>
							<dd>
								{providerStepId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bridgeRouteQuoteStep}
			>
				{#snippet children(entity)}
					{@const stepType = entity.stepType}
					{#if stepType != null}
						<div>
							<dt>step type</dt>
							<dd>
								{stepType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bridgeRouteQuoteStep}
			>
				{#snippet children(entity)}
					{@const tool = entity.tool}
					{#if tool != null}
						<div>
							<dt>tool</dt>
							<dd>
								{tool}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toolName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toolName = entity.toolName}
					{#if toolName != null}
						<div>
							<dt>tool name</dt>
							<dd>
								{toolName}
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
				resource={
					selection({
						fields: {
							fromAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAmount = entity.fromAmount}
					{#if fromAmount != null}
						<div>
							<dt>from amount</dt>
							<dd>
								<NumberValue
									value={fromAmount}
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
								<NumberValue
									value={estimatedGas}
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
							railId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const railId = entity.railId}
					{#if railId != null}
						<div>
							<dt>rail ID</dt>
							<dd>
								{railId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							settlementModel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const settlementModel = entity.settlementModel}
					{#if settlementModel != null}
						<div>
							<dt>settlement model</dt>
							<dd>
								{settlementModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verificationModel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationModel = entity.verificationModel}
					{#if verificationModel != null}
						<div>
							<dt>verification model</dt>
							<dd>
								{verificationModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetOutcome: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetOutcome = entity.assetOutcome}
					{#if assetOutcome != null}
						<div>
							<dt>asset outcome</dt>
							<dd>
								{assetOutcome}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>quote</dt>
				<dd>
					<BridgeRouteQuote_TimestampView
						selection={select(EntityType.BridgeRouteQuote_Timestamp, selection.entitySelector.$quote)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
