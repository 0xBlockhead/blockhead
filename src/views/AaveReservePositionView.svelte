<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: EntitySelectionViewProps<EntityType.AaveReservePosition> = $props()

	const account = $derived(selection.entitySelector.$account)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Aave_Rest,
		],
	}))
	const aaveReservePosition = $derived(viewSelection({
		fields: {
			symbol: true,
			suppliedBalance: true,
			borrowedBalance: true,
		},
	}))
	const titleFallback = $derived((prefetched.symbol ?? '') || 'Aave reserve position')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import AaveReserveView from '$/views/AaveReserveView.svelte'
</script>


<EntityView
	entityType={EntityType.AaveReservePosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/aave-market/[poolAddress=evmAddress]/reserve/[underlyingTokenAddress=evmAddress]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.$actor.address,
					poolAddress: selection.entitySelector.poolAddress,
					underlyingTokenAddress: selection.entitySelector.underlyingTokenAddress,
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
		<ResourceBoundary resource={aaveReservePosition}>
			{#snippet children(entity)}
				{entity.symbol || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aaveReservePosition}>
			{#snippet children(entity)}
				{[(entity.suppliedBalance ?? ''), (entity.borrowedBalance ?? '')].filter(Boolean).join(' ') || entity.symbol || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Reserve</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$reserve}
					>
						{#snippet children(aaveReserve)}
							<AaveReserveView
								selection={select(EntityType.AaveReserve, aaveReserve[EntityMetaKey.Selector])}
								prefetched={aaveReserve}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={aaveReservePosition}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									decimals: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.decimals}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aaveReservePosition}
			>
				{#snippet children(entity)}
					{@const suppliedBalance = entity.suppliedBalance}
					{#if suppliedBalance != null}
						<div>
							<dt>Supplied balance</dt>
							<dd>
								{suppliedBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							suppliedBalanceUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const suppliedBalanceUsd = entity.suppliedBalanceUsd}
					{#if suppliedBalanceUsd != null}
						<div>
							<dt>Supplied balance (USD)</dt>
							<dd>
								{suppliedBalanceUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							supplyApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supplyApy = entity.supplyApy}
					{#if supplyApy != null}
						<div>
							<dt>Supply APY</dt>
							<dd>
								{supplyApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isCollateral: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isCollateral = entity.isCollateral}
					{#if isCollateral != null}
						<div>
							<dt>Used as collateral</dt>
							<dd>
								{isCollateral ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aaveReservePosition}
			>
				{#snippet children(entity)}
					{@const borrowedBalance = entity.borrowedBalance}
					{#if borrowedBalance != null}
						<div>
							<dt>Borrowed balance</dt>
							<dd>
								{borrowedBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowedBalanceUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowedBalanceUsd = entity.borrowedBalanceUsd}
					{#if borrowedBalanceUsd != null}
						<div>
							<dt>Borrowed balance (USD)</dt>
							<dd>
								{borrowedBalanceUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							borrowApy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowApy = entity.borrowApy}
					{#if borrowApy != null}
						<div>
							<dt>Borrow APY</dt>
							<dd>
								{borrowApy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
