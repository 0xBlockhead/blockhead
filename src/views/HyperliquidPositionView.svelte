<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidPosition>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidPosition}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/position/[coin=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					accountId: account.address,
					coin: selection.entitySelector.coin,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Coin</dt>
				<dd>
					{selection.entitySelector.coin}
				</dd>
			</div>

			<div>
				<dt>Size</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									size: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.size}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							entryPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const entryPrice = entity.entryPrice}
					{#if entryPrice != null}
						<div>
							<dt>Entry Price</dt>
							<dd>
								{entryPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Position Value</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									positionValue: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.positionValue}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Unrealized Pnl</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									unrealizedPnl: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.unrealizedPnl}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Return On Equity</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									returnOnEquity: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.returnOnEquity}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							liquidationPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liquidationPrice = entity.liquidationPrice}
					{#if liquidationPrice != null}
						<div>
							<dt>Liquidation Price</dt>
							<dd>
								{liquidationPrice}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Margin Used</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									marginUsed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.marginUsed}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Max Leverage</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									maxLeverage: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.maxLeverage}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative Funding All Time</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cumulativeFundingAllTime: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeFundingAllTime}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative Funding Since Change</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cumulativeFundingSinceChange: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeFundingSinceChange}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative Funding Since Open</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cumulativeFundingSinceOpen: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeFundingSinceOpen}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Leverage Raw Usd</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									leverageRawUsd: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.leverageRawUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Leverage Type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									leverageType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.leverageType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Leverage Value</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									leverageValue: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.leverageValue}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
