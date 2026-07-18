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
			selection: RegisteredEntityProxyResource<EntityType.EvmNetworkActorCoinBalance_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmNetworkActorCoinBalance_Timestamp>>
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
	const evmNetworkActorCoinBalanceTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			balance: true,
			$actorCoin: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
			usdValue: true,
			blockNumber: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || 'EVM network actor coin balance timestamp')
	const viewDomId = $derived('evm-network-actor-coin-balance-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalanceTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const balance0 = pendingEntity.balance}
					{#if balance0 !== undefined && balance0 !== null}
						<NumberValue
							value={balance0}
							decimalPlaces={pendingEntity.$actorCoin.decimals}
						/>

						<span>{pendingEntity.$actorCoin.symbol == null ? '' : ` ${String(pendingEntity.$actorCoin.symbol)}`}</span>
					{/if}
					{@const usdValue1 = pendingEntity.usdValue}
					{#if usdValue1 !== undefined && usdValue1 !== null}
						{String((usdValue1) ?? '')}
					{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalanceTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance0 = resolvedEntity.balance}
					{#if balance0 !== undefined && balance0 !== null}
						<NumberValue
							value={balance0}
							decimalPlaces={resolvedEntity.$actorCoin.decimals}
						/>

						<span>{resolvedEntity.$actorCoin.symbol == null ? '' : ` ${String(resolvedEntity.$actorCoin.symbol)}`}</span>
					{/if}
					{@const usdValue1 = resolvedEntity.usdValue}
					{#if usdValue1 !== undefined && usdValue1 !== null}
						{String((usdValue1) ?? '')}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const blockNumber0 = pendingEntity.blockNumber}
			{#if blockNumber0 !== undefined && blockNumber0 !== null}
				<span data-text="muted">
					{String((blockNumber0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalanceTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber0 = resolvedEntity.blockNumber}
					{#if blockNumber0 !== undefined && blockNumber0 !== null}
						<span data-text="muted">
							{String((blockNumber0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								{String((blockNumber) ?? '')}
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
							balance: true,
							$actorCoin: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance = resolvedEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue
									value={balance}
									decimalPlaces={({ value: balance, ...resolvedEntity }).$actorCoin.decimals}
								/>

								<span>{({ value: balance, ...resolvedEntity }).$actorCoin.symbol == null ? '' : ` ${String(({ value: balance, ...resolvedEntity }).$actorCoin.symbol)}`}</span>
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
							usdValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const usdValue = resolvedEntity.usdValue}
					{#if usdValue !== undefined && usdValue !== null}
						<div>
							<dt>USD value</dt>
							<dd>
								{String((usdValue) ?? '')}
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
							priceUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const priceUsd = resolvedEntity.priceUsd}
					{#if priceUsd !== undefined && priceUsd !== null}
						<div>
							<dt>Price USD</dt>
							<dd>
								{String((priceUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin, {})}
						href={
							(selection.entitySelector.$actorCoin.$actor !== undefined && selection.entitySelector.$actorCoin.$actor.address !== undefined && selection.entitySelector.$actorCoin.$contract !== undefined && selection.entitySelector.$actorCoin.$contract.$network !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2 !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$actorCoin.$contract.address !== undefined ? resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
								owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
								chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
								coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
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
