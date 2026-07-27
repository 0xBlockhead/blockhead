<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BridgeRouteStep> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lifi_Rest,
		],
	}))
	const bridgeRouteStep = $derived(viewSelection({
		fields: {
			tool: true,
			stepType: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.indexInRoute ?? '') ? 'Step #' + String(pendingEntity.indexInRoute ?? '') : '') || 'bridge route step')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInRoute ?? '')}
	href={
		href ?? resolve(
			'/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]',
			{
				fromChainId: String(selection.entitySelector.$route.fromChainId),
				toChainId: String(selection.entitySelector.$route.toChainId),
				fromToken: String(selection.entitySelector.$route.fromToken),
				toToken: String(selection.entitySelector.$route.toToken),
				fromAmount: String(selection.entitySelector.$route.fromAmount),
				fromAddress: String(selection.entitySelector.$route.fromAddress),
				slippage: String(selection.entitySelector.$route.slippage),
				toAddress: String(selection.entitySelector.$route.toAddress),
				stepIndex: String(selection.entitySelector.indexInRoute),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Step </span>
			<span data-badge="small">
				#{String(pendingEntity.indexInRoute)}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.indexInRoute)}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteStep}>
			{#snippet children(entity)}
				{@const tool0 = entity.tool}
				{#if tool0 != null}
					<span data-text="muted">
						{tool0}
					</span>
				{/if}
				{@const stepType1 = entity.stepType}
				{#if stepType1 != null}
					<span data-text="muted">
						{stepType1}
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
					{String(pendingEntity.indexInRoute)}
				</dd>
			</div>

			<ResourceBoundary
				resource={bridgeRouteStep}
			>
				{#snippet children(entity)}
					{@const stepType = entity.stepType}
					{#if stepType != null}
						<div>
							<dt>Step type</dt>
							<dd>
								{stepType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bridgeRouteStep}
			>
				{#snippet children(entity)}
					{@const tool = entity.tool}
					{#if tool != null}
						<div>
							<dt>Tool</dt>
							<dd>
								{tool}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$fromNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>From network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
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
					{#if network != null}
						<div>
							<dt>To network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
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
					{#if evmCoinInstance != null}
						<div>
							<dt>From token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
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
					{#if evmCoinInstance != null}
						<div>
							<dt>To token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
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
					viewSelection({
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
							<dt>Rail ID</dt>
							<dd>
								{railId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
							<dt>Settlement model</dt>
							<dd>
								{settlementModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
							<dt>Verification model</dt>
							<dd>
								{verificationModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
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
							<dt>Asset outcome</dt>
							<dd>
								{assetOutcome}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Route</dt>
				<dd>
					<BridgeRouteView
						selection={select(EntityType.BridgeRoute, selection.entitySelector.$route)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
