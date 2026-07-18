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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BridgeRouteStep>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BridgeRouteStep>>
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
	const bridgeRouteStep = $derived(selection({
		sources: selection.sources,
		fields: {
			tool: true,
			stepType: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInRoute) ?? '') ? 'Step #' + String((pendingEntity.indexInRoute) ?? '') : '') || 'bridge route step')
	const viewDomId = $derived('bridge-route-step-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInRoute ?? '')}
	href={
		href ?? (pendingEntity.indexInRoute !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.fromChainId !== undefined && pendingEntity.$route.toChainId !== undefined && pendingEntity.$route.fromToken !== undefined && pendingEntity.$route.toToken !== undefined && pendingEntity.$route.fromAmount !== undefined && pendingEntity.$route.fromAddress !== undefined && pendingEntity.$route.slippage !== undefined && pendingEntity.$route.toAddress !== undefined ? resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
			stepIndex: String(pendingEntity.indexInRoute ?? ''),
			fromChainId: String(pendingEntity.$route.fromChainId ?? ''),
			toChainId: String(pendingEntity.$route.toChainId ?? ''),
			fromToken: String(pendingEntity.$route.fromToken ?? ''),
			toToken: String(pendingEntity.$route.toToken ?? ''),
			fromAmount: String(pendingEntity.$route.fromAmount ?? ''),
			fromAddress: String(pendingEntity.$route.fromAddress ?? ''),
			slippage: String(pendingEntity.$route.slippage ?? ''),
			toAddress: String(pendingEntity.$route.toAddress ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.indexInRoute}
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
		{@const serialValue = pendingEntity.indexInRoute}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const tool0 = pendingEntity.tool}
			{#if tool0 !== undefined && tool0 !== null}
				<span data-text="muted">
					{String((tool0) ?? '')}
				</span>
			{/if}
			{@const stepType1 = pendingEntity.stepType}
			{#if stepType1 !== undefined && stepType1 !== null}
				<span data-text="muted">
					{String((stepType1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={bridgeRouteStep}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in route</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInRoute: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInRoute = resolvedEntity.indexInRoute}
							{#if indexInRoute !== undefined && indexInRoute !== null}
								{String((indexInRoute) ?? '')}
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
							stepType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stepType = resolvedEntity.stepType}
					{#if stepType !== undefined && stepType !== null}
						<div>
							<dt>Step type</dt>
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
						sources: selection.sources,
						fields: {
							tool: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tool = resolvedEntity.tool}
					{#if tool !== undefined && tool !== null}
						<div>
							<dt>Tool</dt>
							<dd>
								{String((tool) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromNetwork}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>From network</dt>
							<dd>
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
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toNetwork}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>To network</dt>
							<dd>
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
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>From token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native' ?? ''),
										}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
				resource={selection.$toToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>To token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native' ?? ''),
										}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
						sources: selection.sources,
						fields: {
							railId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const railId = resolvedEntity.railId}
					{#if railId !== undefined && railId !== null}
						<div>
							<dt>Rail ID</dt>
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
						sources: selection.sources,
						fields: {
							settlementModel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const settlementModel = resolvedEntity.settlementModel}
					{#if settlementModel !== undefined && settlementModel !== null}
						<div>
							<dt>Settlement model</dt>
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
						sources: selection.sources,
						fields: {
							verificationModel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verificationModel = resolvedEntity.verificationModel}
					{#if verificationModel !== undefined && verificationModel !== null}
						<div>
							<dt>Verification model</dt>
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
						sources: selection.sources,
						fields: {
							assetOutcome: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetOutcome = resolvedEntity.assetOutcome}
					{#if assetOutcome !== undefined && assetOutcome !== null}
						<div>
							<dt>Asset outcome</dt>
							<dd>
								{String((assetOutcome) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Route</dt>
				<dd>
					<BridgeRouteView
						selection={select(EntityType.BridgeRoute, selection.entitySelector.$route, {})}
						href={
							(selection.entitySelector.$route.fromChainId !== undefined && selection.entitySelector.$route.toChainId !== undefined && selection.entitySelector.$route.fromToken !== undefined && selection.entitySelector.$route.toToken !== undefined && selection.entitySelector.$route.fromAmount !== undefined && selection.entitySelector.$route.fromAddress !== undefined && selection.entitySelector.$route.slippage !== undefined && selection.entitySelector.$route.toAddress !== undefined ? resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', {
								fromChainId: String(selection.entitySelector.$route.fromChainId ?? ''),
								toChainId: String(selection.entitySelector.$route.toChainId ?? ''),
								fromToken: String(selection.entitySelector.$route.fromToken ?? ''),
								toToken: String(selection.entitySelector.$route.toToken ?? ''),
								fromAmount: String(selection.entitySelector.$route.fromAmount ?? ''),
								fromAddress: String(selection.entitySelector.$route.fromAddress ?? ''),
								slippage: String(selection.entitySelector.$route.slippage ?? ''),
								toAddress: String(selection.entitySelector.$route.toAddress ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
