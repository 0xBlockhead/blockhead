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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BridgeRoute>>
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
	const bridgeRoute = $derived(selection({
		sources: [
			Source.Lifi_Rest,
		],
		fields: {
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route')
	const viewDomId = $derived('bridge-route-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.fromChainId !== undefined && pendingEntity.toChainId !== undefined && pendingEntity.fromToken !== undefined && pendingEntity.toToken !== undefined && pendingEntity.fromAmount !== undefined && pendingEntity.fromAddress !== undefined && pendingEntity.slippage !== undefined && pendingEntity.toAddress !== undefined ? resolve('/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', {
			fromChainId: String(pendingEntity.fromChainId ?? ''),
			toChainId: String(pendingEntity.toChainId ?? ''),
			fromToken: String(pendingEntity.fromToken ?? ''),
			toToken: String(pendingEntity.toToken ?? ''),
			fromAmount: String(pendingEntity.fromAmount ?? ''),
			fromAddress: String(pendingEntity.fromAddress ?? ''),
			slippage: String(pendingEntity.slippage ?? ''),
			toAddress: String(pendingEntity.toAddress ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bridgeRoute}>
			{#snippet Pending()}
				{[String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.fromChainId) ?? ''), 'to', String((resolvedEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bridgeRoute}>
			{#snippet Pending()}
				{['LI.FI quote'].filter(Boolean).join(' ') || [String((pendingEntity.fromChainId) ?? ''), 'to', String((pendingEntity.toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{['LI.FI quote'].filter(Boolean).join(' ') || [String((resolvedEntity.fromChainId) ?? ''), 'to', String((resolvedEntity.toChainId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRoute}>
			{#snippet Pending()}
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
			{/snippet}

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
				<dt>From token</dt>
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
				<dt>To token</dt>
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
				<dt>From address</dt>
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
				<dt>To address</dt>
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
				<dt>From amount</dt>
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

			<div>
				<dt>To amount</dt>
				<dd>
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
								<NumberValue value={Number(toAmount)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toAmount = resolvedEntity.toAmount}
							{#if toAmount !== undefined && toAmount !== null}
								<NumberValue value={Number(toAmount)} />
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
								fields: {
									toAmountMin: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toAmountMin = pendingEntity.toAmountMin}
							{#if toAmountMin !== undefined && toAmountMin !== null}
								<NumberValue value={Number(toAmountMin)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toAmountMin = resolvedEntity.toAmountMin}
							{#if toAmountMin !== undefined && toAmountMin !== null}
								<NumberValue value={Number(toAmountMin)} />
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

			<div>
				<dt>Estimated cost USD</dt>
				<dd>
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
								{String((estimatedCostUsd) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									estimatedDurationSeconds: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const estimatedDurationSeconds = pendingEntity.estimatedDurationSeconds}
							{#if estimatedDurationSeconds !== undefined && estimatedDurationSeconds !== null}
								{String((estimatedDurationSeconds) ?? '')}
							{/if}
						{/snippet}

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
			<BridgeRouteStepsView
				selection={
						selection.$$steps({
							sources: [
								Source.Lifi_Rest,
							],
							count: true,
						})
					}
				title='Steps'
				emptyText='No steps on this route.'
				id='BridgeRouteStepsView-steps'
			/>
		{/if}
	{/snippet}
</EntityView>
