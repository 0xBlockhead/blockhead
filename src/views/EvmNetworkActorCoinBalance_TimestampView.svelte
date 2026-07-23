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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmNetworkActorCoinBalance_Timestamp>
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
	const evmNetworkActorCoinBalanceTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
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
	} : {
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
	const viewDomId = $derived('evm-network-actor-coin-balance-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		<ResourceBoundary resource={evmNetworkActorCoinBalanceTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
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
	{/snippet}

	{#snippet HeadingAfter()}
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
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						href={
							(
								selection.entitySelector.$actorCoin != null && '$actor' in selection.entitySelector.$actorCoin
								&& selection.entitySelector.$actorCoin.$actor != null && 'address' in selection.entitySelector.$actorCoin.$actor
								&& selection.entitySelector.$actorCoin.$actor.address != null
								&& selection.entitySelector.$actorCoin != null && '$contract' in selection.entitySelector.$actorCoin
								&& selection.entitySelector.$actorCoin.$contract != null && '$network' in selection.entitySelector.$actorCoin.$contract
								&& selection.entitySelector.$actorCoin.$contract.$network != null && 'caip2' in selection.entitySelector.$actorCoin.$contract.$network
								&& selection.entitySelector.$actorCoin.$contract.$network.caip2 != null && 'reference' in selection.entitySelector.$actorCoin.$contract.$network.caip2
								&& selection.entitySelector.$actorCoin.$contract.$network.caip2.reference != null
								&& selection.entitySelector.$actorCoin.$contract != null && 'address' in selection.entitySelector.$actorCoin.$contract
								&& selection.entitySelector.$actorCoin.$contract.address != null ?
									resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
								owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
								chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
								coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
