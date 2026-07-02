<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { bridgeRouteTagByTag } from '$/constants/Bridge.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRoute>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BridgeRoute>>
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

	const bridgeRoute = $derived(selection({
		sources: [
			Source.Lifi_Rest,
		],
		fields: {
			$fromNetwork: true,
			$toNetwork: true,
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
			...(open && {
				fromAmount: true,
				toAmount: true,
				toAmountMin: true,
				estimatedCostUsd: true,
				estimatedDurationSeconds: true,
				tags: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).fromChainId) ?? ''), 'to', String((({ ...selection.entitySelector, ...prefetched }).toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route')
	const viewDomId = $derived('bridge-route-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BridgeRouteStepsView from '$/views/BridgeRouteStepsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRoute}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).fromChainId) ?? ''), 'to', String((({ ...selection.entitySelector, ...prefetched }).toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route'}
		{:else}
			<ResourceBoundary resource={bridgeRoute}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).fromChainId) ?? ''), 'to', String((({ ...selection.entitySelector, ...prefetched }).toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.fromChainId) ?? ''), 'to', String((entity.toChainId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['LI.FI quote'].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).fromChainId) ?? ''), 'to', String((({ ...selection.entitySelector, ...prefetched }).toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route'}
		{:else}
			<ResourceBoundary resource={bridgeRoute}>
				{#snippet Pending()}
					{['LI.FI quote'].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).fromChainId) ?? ''), 'to', String((({ ...selection.entitySelector, ...prefetched }).toChainId) ?? '')].filter(Boolean).join(' ') || title || 'bridge route'}
				{/snippet}

				{#snippet children(entity)}
					{['LI.FI quote'].filter(Boolean).join(' ') || [String((entity.fromChainId) ?? ''), 'to', String((entity.toChainId) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const estimatedCostUsd0 = prefetched.estimatedCostUsd}
			{#if estimatedCostUsd0 !== undefined && estimatedCostUsd0 !== null}
				<span data-text="muted">
					{String((estimatedCostUsd0) ?? '')}
				</span>
			{/if}
			{@const estimatedDurationSeconds1 = prefetched.estimatedDurationSeconds}
			{#if estimatedDurationSeconds1 !== undefined && estimatedDurationSeconds1 !== null}
				<span data-text="muted">
					{String((estimatedDurationSeconds1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={bridgeRoute}>
				{#snippet Pending()}
					{@const estimatedCostUsd0 = prefetched.estimatedCostUsd}
					{#if estimatedCostUsd0 !== undefined && estimatedCostUsd0 !== null}
						<span data-text="muted">
							{String((estimatedCostUsd0) ?? '')}
						</span>
					{/if}
					{@const estimatedDurationSeconds1 = prefetched.estimatedDurationSeconds}
					{#if estimatedDurationSeconds1 !== undefined && estimatedDurationSeconds1 !== null}
						<span data-text="muted">
							{String((estimatedDurationSeconds1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const estimatedCostUsd0 = entity.estimatedCostUsd}
					{#if estimatedCostUsd0 !== undefined && estimatedCostUsd0 !== null}
						<span data-text="muted">
							{String((estimatedCostUsd0) ?? '')}
						</span>
					{/if}
					{@const estimatedDurationSeconds1 = entity.estimatedDurationSeconds}
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
						resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$fromNetwork')}
					>
						{#snippet children(evmNetwork)}
							<EvmNetworkView
								selection={select(EntityType.EvmNetwork, evmNetwork.entitySelector)}
								prefetched={evmNetwork}
								href={
									(evmNetwork.entitySelector?.caip2 != null && evmNetwork.entitySelector?.caip2?.namespace != null && evmNetwork.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
										caip2: `${String(evmNetwork.entitySelector.caip2.namespace)}:${String(evmNetwork.entitySelector.caip2.reference)}`,
									}) : evmNetwork.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
										networkSlug: String(evmNetwork.entitySelector.slug),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To network</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$toNetwork')}
					>
						{#snippet children(evmNetwork)}
							<EvmNetworkView
								selection={select(EntityType.EvmNetwork, evmNetwork.entitySelector)}
								prefetched={evmNetwork}
								href={
									(evmNetwork.entitySelector?.caip2 != null && evmNetwork.entitySelector?.caip2?.namespace != null && evmNetwork.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
										caip2: `${String(evmNetwork.entitySelector.caip2.namespace)}:${String(evmNetwork.entitySelector.caip2.reference)}`,
									}) : evmNetwork.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
										networkSlug: String(evmNetwork.entitySelector.slug),
									}) : undefined)
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>From token</dt>
				<dd>
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const fromToken = prefetched.fromToken ?? selection.entitySelector.fromToken}
							{#if fromToken !== undefined && fromToken !== null}
								<TruncatedValue value={String(fromToken)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const fromToken = entity.fromToken ?? selection.entitySelector.fromToken ?? prefetched.fromToken}
							{#if fromToken !== undefined && fromToken !== null}
								<TruncatedValue value={String(fromToken)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To token</dt>
				<dd>
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const toToken = prefetched.toToken ?? selection.entitySelector.toToken}
							{#if toToken !== undefined && toToken !== null}
								<TruncatedValue value={String(toToken)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const toToken = entity.toToken ?? selection.entitySelector.toToken ?? prefetched.toToken}
							{#if toToken !== undefined && toToken !== null}
								<TruncatedValue value={String(toToken)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>From address</dt>
				<dd>
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const fromAddress = prefetched.fromAddress ?? selection.entitySelector.fromAddress}
							{#if fromAddress !== undefined && fromAddress !== null}
								{String((fromAddress) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const fromAddress = entity.fromAddress ?? selection.entitySelector.fromAddress ?? prefetched.fromAddress}
							{#if fromAddress !== undefined && fromAddress !== null}
								{String((fromAddress) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To address</dt>
				<dd>
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const toAddress = prefetched.toAddress ?? selection.entitySelector.toAddress}
							{#if toAddress !== undefined && toAddress !== null}
								{String((toAddress) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const toAddress = entity.toAddress ?? selection.entitySelector.toAddress ?? prefetched.toAddress}
							{#if toAddress !== undefined && toAddress !== null}
								{String((toAddress) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>From amount</dt>
				<dd>
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const fromAmount = prefetched.fromAmount ?? selection.entitySelector.fromAmount}
							{#if fromAmount !== undefined && fromAmount !== null}
								<NumberValue value={Number(fromAmount)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const fromAmount = entity.fromAmount ?? selection.entitySelector.fromAmount ?? prefetched.fromAmount}
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
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const toAmount = prefetched.toAmount ?? selection.entitySelector.toAmount}
							{#if toAmount !== undefined && toAmount !== null}
								<NumberValue value={Number(toAmount)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const toAmount = entity.toAmount ?? selection.entitySelector.toAmount ?? prefetched.toAmount}
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
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const toAmountMin = prefetched.toAmountMin ?? selection.entitySelector.toAmountMin}
							{#if toAmountMin !== undefined && toAmountMin !== null}
								<NumberValue value={Number(toAmountMin)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const toAmountMin = entity.toAmountMin ?? selection.entitySelector.toAmountMin ?? prefetched.toAmountMin}
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
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const slippage = prefetched.slippage ?? selection.entitySelector.slippage}
							{#if slippage !== undefined && slippage !== null}
								{String((slippage) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const slippage = entity.slippage ?? selection.entitySelector.slippage ?? prefetched.slippage}
							{#if slippage !== undefined && slippage !== null}
								{String((slippage) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tags</dt>
				<dd>
					<ResourceBoundary resource={bridgeRoute}>
						{#snippet Pending()}
							{@const tags = prefetched.tags ?? selection.entitySelector.tags}
							{#if tags !== undefined && tags !== null}
								{tags == null ? '' : String(((tags).map((tag) => bridgeRouteTagByTag[tag].label).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const tags = entity.tags ?? selection.entitySelector.tags ?? prefetched.tags}
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
				selection={selection[EntityProxyField]<EntityType.BridgeRouteStep>('$$steps')}
				title='Steps'
				emptyText='No steps on this route.'
				id='BridgeRouteStepsView-$$steps'
			/>
		{/if}
	{/snippet}
</EntityView>
