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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteQuoteStep>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BridgeRouteQuoteStep>>
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
	const bridgeRouteQuoteStep = $derived(selection({
		fields: {
			tool: true,
			stepType: true,
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.indexInQuote ?? prefetched.indexInQuote) ?? '') ? 'Step #' + String((selection.entitySelector.indexInQuote ?? prefetched.indexInQuote) ?? '') : '') || 'bridge route quote step')
	const viewDomId = $derived('bridge-route-quote-step-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteQuoteStep}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.indexInQuote ?? prefetched.indexInQuote ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.indexInQuote ?? prefetched.indexInQuote}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Step </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = selection.entitySelector.indexInQuote ?? prefetched.indexInQuote}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteQuoteStep}>
			{#snippet Pending()}
				{@const tool0 = prefetched.tool}
				{#if tool0 !== undefined && tool0 !== null}
					<span data-text="muted">
						{String((tool0) ?? '')}
					</span>
				{/if}
				{@const stepType1 = prefetched.stepType}
				{#if stepType1 !== undefined && stepType1 !== null}
					<span data-text="muted">
						{String((stepType1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const tool0 = resolvedEntity.tool}
				{#if tool0 !== undefined && tool0 !== null}
					<span data-text="muted">
						{String((tool0) ?? '')}
					</span>
				{/if}
				{@const stepType1 = resolvedEntity.stepType}
				{#if stepType1 !== undefined && stepType1 !== null}
					<span data-text="muted">
						{String((stepType1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>index in quote</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInQuote: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInQuote = selection.entitySelector.indexInQuote ?? prefetched.indexInQuote}
							{#if indexInQuote !== undefined && indexInQuote !== null}
								{String((indexInQuote) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInQuote = resolvedEntity.indexInQuote}
							{#if indexInQuote !== undefined && indexInQuote !== null}
								{String((indexInQuote) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const providerStepId = prefetched.providerStepId}
					{#if providerStepId !== undefined && providerStepId !== null}
						<div>
							<dt>provider step ID</dt>
							<dd>
								{String((providerStepId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerStepId = resolvedEntity.providerStepId}
					{#if providerStepId !== undefined && providerStepId !== null}
						<div>
							<dt>provider step ID</dt>
							<dd>
								{String((providerStepId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stepType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stepType = prefetched.stepType}
					{#if stepType !== undefined && stepType !== null}
						<div>
							<dt>step type</dt>
							<dd>
								{String((stepType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stepType = resolvedEntity.stepType}
					{#if stepType !== undefined && stepType !== null}
						<div>
							<dt>step type</dt>
							<dd>
								{String((stepType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tool: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tool = prefetched.tool}
					{#if tool !== undefined && tool !== null}
						<div>
							<dt>tool</dt>
							<dd>
								{String((tool) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tool = resolvedEntity.tool}
					{#if tool !== undefined && tool !== null}
						<div>
							<dt>tool</dt>
							<dd>
								{String((tool) ?? '')}
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
				{#snippet Pending()}
					{@const toolName = prefetched.toolName}
					{#if toolName !== undefined && toolName !== null}
						<div>
							<dt>tool name</dt>
							<dd>
								{String((toolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toolName = resolvedEntity.toolName}
					{#if toolName !== undefined && toolName !== null}
						<div>
							<dt>tool name</dt>
							<dd>
								{String((toolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$fromNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>from network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									href={
										(evmNetwork[EntityMetaKey.Selector].caip2 !== undefined && evmNetwork[EntityMetaKey.Selector].caip2.namespace !== undefined && evmNetwork[EntityMetaKey.Selector].caip2 !== undefined && evmNetwork[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(evmNetwork[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(evmNetwork[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$toNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>to network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									href={
										(evmNetwork[EntityMetaKey.Selector].caip2 !== undefined && evmNetwork[EntityMetaKey.Selector].caip2.namespace !== undefined && evmNetwork[EntityMetaKey.Selector].caip2 !== undefined && evmNetwork[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(evmNetwork[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(evmNetwork[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
										(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
										(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
										}) : undefined)
									}
									layout={EntityLayout.Value}
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
							fromAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fromAmount = prefetched.fromAmount}
					{#if fromAmount !== undefined && fromAmount !== null}
						<div>
							<dt>from amount</dt>
							<dd>
								<NumberValue value={Number(fromAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromAmount = resolvedEntity.fromAmount}
					{#if fromAmount !== undefined && fromAmount !== null}
						<div>
							<dt>from amount</dt>
							<dd>
								<NumberValue value={Number(fromAmount)} />
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
				{#snippet Pending()}
					{@const toAmount = prefetched.toAmount}
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
					{@const toAmountMin = prefetched.toAmountMin}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							estimatedGas: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const estimatedGas = prefetched.estimatedGas}
					{#if estimatedGas !== undefined && estimatedGas !== null}
						<div>
							<dt>estimated gas</dt>
							<dd>
								<NumberValue value={Number(estimatedGas)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const estimatedGas = resolvedEntity.estimatedGas}
					{#if estimatedGas !== undefined && estimatedGas !== null}
						<div>
							<dt>estimated gas</dt>
							<dd>
								<NumberValue value={Number(estimatedGas)} />
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
				{#snippet Pending()}
					{@const railId = prefetched.railId}
					{#if railId !== undefined && railId !== null}
						<div>
							<dt>rail ID</dt>
							<dd>
								{String((railId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const railId = resolvedEntity.railId}
					{#if railId !== undefined && railId !== null}
						<div>
							<dt>rail ID</dt>
							<dd>
								{String((railId) ?? '')}
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
				{#snippet Pending()}
					{@const settlementModel = prefetched.settlementModel}
					{#if settlementModel !== undefined && settlementModel !== null}
						<div>
							<dt>settlement model</dt>
							<dd>
								{String((settlementModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const settlementModel = resolvedEntity.settlementModel}
					{#if settlementModel !== undefined && settlementModel !== null}
						<div>
							<dt>settlement model</dt>
							<dd>
								{String((settlementModel) ?? '')}
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
				{#snippet Pending()}
					{@const verificationModel = prefetched.verificationModel}
					{#if verificationModel !== undefined && verificationModel !== null}
						<div>
							<dt>verification model</dt>
							<dd>
								{String((verificationModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verificationModel = resolvedEntity.verificationModel}
					{#if verificationModel !== undefined && verificationModel !== null}
						<div>
							<dt>verification model</dt>
							<dd>
								{String((verificationModel) ?? '')}
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
				{#snippet Pending()}
					{@const assetOutcome = prefetched.assetOutcome}
					{#if assetOutcome !== undefined && assetOutcome !== null}
						<div>
							<dt>asset outcome</dt>
							<dd>
								{String((assetOutcome) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetOutcome = resolvedEntity.assetOutcome}
					{#if assetOutcome !== undefined && assetOutcome !== null}
						<div>
							<dt>asset outcome</dt>
							<dd>
								{String((assetOutcome) ?? '')}
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
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
