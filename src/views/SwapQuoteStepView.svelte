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
			selection: RegisteredEntityProxyResource<EntityType.SwapQuoteStep>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SwapQuoteStep>>
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
	const swapQuoteStep = $derived(selection({}))
	const titleFallback = $derived('swap quote step')
	const viewDomId = $derived('swap-quote-step-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SwapQuote_TimestampView from '$/views/SwapQuote_TimestampView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.SwapQuoteStep}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={swapQuoteStep}>
			{#snippet Pending()}
				{title || 'swap quote step'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>quote</dt>
				<dd>
					<SwapQuote_TimestampView
						selection={select(EntityType.SwapQuote_Timestamp, selection.entitySelector.$quote, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
							{@const indexInQuote = pendingEntity.indexInQuote}
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
					{@const providerStepId = pendingEntity.providerStepId}
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
					{@const stepType = pendingEntity.stepType}
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
							protocol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const protocol = pendingEntity.protocol}
					{#if protocol !== undefined && protocol !== null}
						<div>
							<dt>protocol</dt>
							<dd>
								{String((protocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocol = resolvedEntity.protocol}
					{#if protocol !== undefined && protocol !== null}
						<div>
							<dt>protocol</dt>
							<dd>
								{String((protocol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const poolId = pendingEntity.poolId}
					{#if poolId !== undefined && poolId !== null}
						<div>
							<dt>pool ID</dt>
							<dd>
								{String((poolId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const poolId = resolvedEntity.poolId}
					{#if poolId !== undefined && poolId !== null}
						<div>
							<dt>pool ID</dt>
							<dd>
								{String((poolId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$liquidityPool}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(liquidityPool)}
					{#if liquidityPool != null && liquidityPool[EntityMetaKey.Selector] != null}
						<div>
							<dt>liquidity pool</dt>
							<dd>
								<LiquidityPoolView
									selection={select(EntityType.LiquidityPool, liquidityPool[EntityMetaKey.Selector])}
									prefetched={liquidityPool}
									href={
										(liquidityPool[EntityMetaKey.Selector].id !== undefined && liquidityPool[EntityMetaKey.Selector].$network !== undefined && liquidityPool[EntityMetaKey.Selector].$network.caip2 !== undefined && liquidityPool[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', {
											poolId: String(liquidityPool[EntityMetaKey.Selector].id ?? ''),
											chainId: String(liquidityPool[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
				resource={selection.$tokenIn}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>token in</dt>
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
				resource={selection.$tokenOut}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>token out</dt>
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
				resource={
					selection({
						fields: {
							amountIn: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountIn = pendingEntity.amountIn}
					{#if amountIn !== undefined && amountIn !== null}
						<div>
							<dt>amount in</dt>
							<dd>
								{String((amountIn) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountIn = resolvedEntity.amountIn}
					{#if amountIn !== undefined && amountIn !== null}
						<div>
							<dt>amount in</dt>
							<dd>
								{String((amountIn) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountOut: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountOut = pendingEntity.amountOut}
					{#if amountOut !== undefined && amountOut !== null}
						<div>
							<dt>amount out</dt>
							<dd>
								{String((amountOut) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountOut = resolvedEntity.amountOut}
					{#if amountOut !== undefined && amountOut !== null}
						<div>
							<dt>amount out</dt>
							<dd>
								{String((amountOut) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeBps: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeBps = pendingEntity.feeBps}
					{#if feeBps !== undefined && feeBps !== null}
						<div>
							<dt>fee bps</dt>
							<dd>
								{String((feeBps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeBps = resolvedEntity.feeBps}
					{#if feeBps !== undefined && feeBps !== null}
						<div>
							<dt>fee bps</dt>
							<dd>
								{String((feeBps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shareBps: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shareBps = pendingEntity.shareBps}
					{#if shareBps !== undefined && shareBps !== null}
						<div>
							<dt>share bps</dt>
							<dd>
								{String((shareBps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shareBps = resolvedEntity.shareBps}
					{#if shareBps !== undefined && shareBps !== null}
						<div>
							<dt>share bps</dt>
							<dd>
								{String((shareBps) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasEstimate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasEstimate = pendingEntity.gasEstimate}
					{#if gasEstimate !== undefined && gasEstimate !== null}
						<div>
							<dt>gas estimate</dt>
							<dd>
								{String((gasEstimate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasEstimate = resolvedEntity.gasEstimate}
					{#if gasEstimate !== undefined && gasEstimate !== null}
						<div>
							<dt>gas estimate</dt>
							<dd>
								{String((gasEstimate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
