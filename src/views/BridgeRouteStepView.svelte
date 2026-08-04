<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import {
		bridgeAssetOutcomeByAssetOutcome,
		bridgeRailById,
		bridgeRouteStepTypeByWire,
		bridgeSettlementModelBySettlementModel,
		bridgeToolByKey,
		bridgeVerificationModelByVerificationModel,
	} from '$/constants/Bridge.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BridgeRouteStep>, 'prefetched'> = $props()

	const route = $derived(selection.entitySelector.$route)
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
	title={title ?? `Step #${selection.entitySelector.indexInRoute}`}
	idDragPlainText={String(selection.entitySelector.indexInRoute)}
	href={
		href === undefined ?
			resolve(
				'/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]',
				{
					fromChainId: String(route.fromChainId),
					toChainId: String(route.toChainId),
					fromToken: route.fromToken,
					toToken: route.toToken,
					fromAmount: String(route.fromAmount),
					fromAddress: route.fromAddress,
					slippage: String(route.slippage),
					toAddress: route.toAddress,
					stepIndex: String(selection.entitySelector.indexInRoute),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Step </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInRoute}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.indexInRoute}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRouteStep}>
			{#snippet children(entity)}
				{@const tool = entity.tool}
				{#if tool != null}
					<span data-text="muted">
						{
							tool in bridgeToolByKey ?
								bridgeToolByKey[tool].label
							:
								tool
						}
					</span>
				{/if}
				{@const stepType = entity.stepType}
				{#if stepType != null}
					<span data-text="muted">
						{
							stepType in bridgeRouteStepTypeByWire ?
								bridgeRouteStepTypeByWire[stepType].label
							:
								stepType
						}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={bridgeRouteStep}
			>
				{#snippet children(entity)}
					{@const stepType = entity.stepType}
					{#if stepType != null}
						<div>
							<dt>step type</dt>
							<dd>
								{
									stepType in bridgeRouteStepTypeByWire ?
										bridgeRouteStepTypeByWire[stepType].label
									:
										stepType
								}
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
							<dt>tool</dt>
							<dd>
								{
									tool in bridgeToolByKey ?
										bridgeToolByKey[tool].label
									:
										tool
								}
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
							<dt>from network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
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
									open={false}
									showTypeAnnotation={false}
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
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
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
									layout={EntityLayout.SummaryDetails}
									open={false}
									showTypeAnnotation={false}
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
							<dt>rail</dt>
							<dd>
								{
									railId in bridgeRailById ?
										bridgeRailById[railId].label
									:
										railId
								}
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
							<dt>settlement model</dt>
							<dd>
								{
									settlementModel in bridgeSettlementModelBySettlementModel ?
										bridgeSettlementModelBySettlementModel[settlementModel].label
									:
										settlementModel
								}
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
							<dt>verification model</dt>
							<dd>
								{
									verificationModel in bridgeVerificationModelByVerificationModel ?
										bridgeVerificationModelByVerificationModel[verificationModel].label
									:
										verificationModel
								}
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
							<dt>asset outcome</dt>
							<dd>
								{
									assetOutcome in bridgeAssetOutcomeByAssetOutcome ?
										bridgeAssetOutcomeByAssetOutcome[assetOutcome].label
									:
										assetOutcome
								}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>route</dt>
				<dd>
					<BridgeRouteView
						selection={select(EntityType.BridgeRoute, selection.entitySelector.$route)}
						layout={EntityLayout.Value}
						open={false}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
