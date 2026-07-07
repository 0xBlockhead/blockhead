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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteStep>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BridgeRouteStep>>
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
		sources: [
			Source.Lifi_Rest,
		],
		fields: {
			tool: true,
			stepType: true,
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.indexInRoute ?? prefetched.indexInRoute) ?? '') ? 'Step #' + String((selection.entitySelector.indexInRoute ?? prefetched.indexInRoute) ?? '') : '') || 'bridge route step')
	const viewDomId = $derived('bridge-route-step-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.indexInRoute ?? prefetched.indexInRoute ?? '')}
	href={
		href ?? (pendingEntity.$route !== undefined && pendingEntity.$route.fromChainId !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.toChainId !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.fromToken !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.toToken !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.fromAmount !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.fromAddress !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.slippage !== undefined && pendingEntity.$route !== undefined && pendingEntity.$route.toAddress !== undefined && pendingEntity.indexInRoute !== undefined ? resolve('/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex=bridgeRouteStepIndex]', {
			fromChainId: String(pendingEntity.$route.fromChainId ?? ''),
			toChainId: String(pendingEntity.$route.toChainId ?? ''),
			fromToken: String(pendingEntity.$route.fromToken ?? ''),
			toToken: String(pendingEntity.$route.toToken ?? ''),
			fromAmount: String(pendingEntity.$route.fromAmount ?? ''),
			fromAddress: String(pendingEntity.$route.fromAddress ?? ''),
			slippage: String(pendingEntity.$route.slippage ?? ''),
			toAddress: String(pendingEntity.$route.toAddress ?? ''),
			stepIndex: String(pendingEntity.indexInRoute ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.indexInRoute ?? prefetched.indexInRoute}
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
		{@const serialValue = selection.entitySelector.indexInRoute ?? prefetched.indexInRoute}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteStep}>
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
				<dt>Index in route</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInRoute: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInRoute = selection.entitySelector.indexInRoute ?? prefetched.indexInRoute}
							{#if indexInRoute !== undefined && indexInRoute !== null}
								{String((indexInRoute) ?? '')}
							{/if}
						{/snippet}

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
							<dt>Step type</dt>
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
							<dt>Tool</dt>
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
							<dt>Tool</dt>
							<dd>
								{String((tool) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$fromNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>From network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
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
							<dt>To network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
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
							<dt>From token</dt>
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
							<dt>To token</dt>
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
							railId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const railId = prefetched.railId}
					{#if railId !== undefined && railId !== null}
						<div>
							<dt>Rail ID</dt>
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
							<dt>Settlement model</dt>
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
							<dt>Verification model</dt>
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
							<dt>Asset outcome</dt>
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
							(selection.entitySelector.$route.fromChainId !== undefined && selection.entitySelector.$route.toChainId !== undefined && selection.entitySelector.$route.fromToken !== undefined && selection.entitySelector.$route.toToken !== undefined && selection.entitySelector.$route.fromAmount !== undefined && selection.entitySelector.$route.fromAddress !== undefined && selection.entitySelector.$route.slippage !== undefined && selection.entitySelector.$route.toAddress !== undefined ? resolve('/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]', {
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
