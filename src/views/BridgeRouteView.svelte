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
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.BridgeRoute>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BridgeRoute>
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
	const bridgeRoute = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route')
	const viewDomId = $derived('bridge-route-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BridgeRouteStepsView from '$/views/BridgeRouteStepsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRoute}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'fromChainId' in selection.entitySelector
			&& selection.entitySelector.fromChainId != null
			&& selection.entitySelector != null && 'toChainId' in selection.entitySelector
			&& selection.entitySelector.toChainId != null
			&& selection.entitySelector != null && 'fromToken' in selection.entitySelector
			&& selection.entitySelector.fromToken != null
			&& selection.entitySelector != null && 'toToken' in selection.entitySelector
			&& selection.entitySelector.toToken != null
			&& selection.entitySelector != null && 'fromAmount' in selection.entitySelector
			&& selection.entitySelector.fromAmount != null
			&& selection.entitySelector != null && 'fromAddress' in selection.entitySelector
			&& selection.entitySelector.fromAddress != null
			&& selection.entitySelector != null && 'slippage' in selection.entitySelector
			&& selection.entitySelector.slippage != null
			&& selection.entitySelector != null && 'toAddress' in selection.entitySelector
			&& selection.entitySelector.toAddress != null ?
				resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', {
			fromChainId: String(selection.entitySelector.fromChainId ?? ''),
			toChainId: String(selection.entitySelector.toChainId ?? ''),
			fromToken: String(selection.entitySelector.fromToken ?? ''),
			toToken: String(selection.entitySelector.toToken ?? ''),
			fromAmount: String(selection.entitySelector.fromAmount ?? ''),
			fromAddress: String(selection.entitySelector.fromAddress ?? ''),
			slippage: String(selection.entitySelector.slippage ?? ''),
			toAddress: String(selection.entitySelector.toAddress ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'estimatedCostUsd') && Object.hasOwn(prefetched, 'estimatedDurationSeconds')}
			{[String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={bridgeRoute}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.fromChainId) ?? ''), 'to', String((resolvedEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'estimatedCostUsd') && Object.hasOwn(prefetched, 'estimatedDurationSeconds')}
			{['LI.FI quote'].filter(Boolean).join(' ') || [String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={bridgeRoute}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{['LI.FI quote'].filter(Boolean).join(' ') || [String((resolvedEntity.fromChainId) ?? ''), 'to', String((resolvedEntity.toChainId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'estimatedCostUsd') && Object.hasOwn(prefetched, 'estimatedDurationSeconds')}
			{@const estimatedCostUsd0 = pendingEntity.estimatedCostUsd}
			{#if estimatedCostUsd0 !== undefined && estimatedCostUsd0 !== null}
				<span data-text="muted">
					{String((estimatedCostUsd0) ?? '')}
				</span>
			{/if}
			{@const estimatedDurationSeconds1 = pendingEntity.estimatedDurationSeconds}
			{#if estimatedDurationSeconds1 !== undefined && estimatedDurationSeconds1 !== null}
				<span data-text="muted">
					{String((estimatedDurationSeconds1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={bridgeRoute}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const estimatedCostUsd0 = resolvedEntity.estimatedCostUsd}
					{#if estimatedCostUsd0 !== undefined && estimatedCostUsd0 !== null}
						<span data-text="muted">
							{String((estimatedCostUsd0) ?? '')}
						</span>
					{/if}
					{@const estimatedDurationSeconds1 = resolvedEntity.estimatedDurationSeconds}
					{#if estimatedDurationSeconds1 !== undefined && estimatedDurationSeconds1 !== null}
						<span data-text="muted">
							{String((estimatedDurationSeconds1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>From network</dt>
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
				<dt>To network</dt>
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
				<dt>From token</dt>
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
				<dt>To token</dt>
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
				<dt>From address</dt>
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
				<dt>To address</dt>
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
				<dt>From amount</dt>
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

			<div>
				<dt>To amount</dt>
				<dd>
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
								<NumberValue
									value={toAmount}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To amount min</dt>
				<dd>
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
								<NumberValue
									value={toAmountMin}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slippage</dt>
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

			<div>
				<dt>Estimated cost USD</dt>
				<dd>
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
								{String((estimatedCostUsd) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Estimated duration seconds</dt>
				<dd>
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
								{String((estimatedDurationSeconds) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tags</dt>
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
				{@const bridgeRouteBridgeRouteStepsViewStepsResource = selection
		.$$steps({
			sources: [
				Source.Lifi_Rest,
			],
		})}
				<ResourceBoundary
					resource={bridgeRouteBridgeRouteStepsViewStepsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<BridgeRouteStepsView
							selection={bridgeRouteBridgeRouteStepsViewStepsResource}
							countResource={bridgeRouteBridgeRouteStepsViewStepsResource.count}
							title='Steps'
							id='BridgeRouteStepsView-steps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
