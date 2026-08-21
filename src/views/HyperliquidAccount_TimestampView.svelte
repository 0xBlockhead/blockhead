<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidAccount_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Info operation</dt>
				<dd>
					{selection.entitySelector.infoType}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountValue = entity.accountValue}
					{#if accountValue != null}
						<div>
							<dt>account value</dt>
							<dd>
								{accountValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalNtlPos: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalNtlPos = entity.totalNtlPos}
					{#if totalNtlPos != null}
						<div>
							<dt>total ntl pos</dt>
							<dd>
								{totalNtlPos}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalRawUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalRawUsd = entity.totalRawUsd}
					{#if totalRawUsd != null}
						<div>
							<dt>total raw usd</dt>
							<dd>
								{totalRawUsd}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalMarginUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalMarginUsed = entity.totalMarginUsed}
					{#if totalMarginUsed != null}
						<div>
							<dt>total margin used</dt>
							<dd>
								{totalMarginUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawable = entity.withdrawable}
					{#if withdrawable != null}
						<div>
							<dt>withdrawable</dt>
							<dd>
								{withdrawable}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							crossMaintenanceMarginUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const crossMaintenanceMarginUsed = entity.crossMaintenanceMarginUsed}
					{#if crossMaintenanceMarginUsed != null}
						<div>
							<dt>cross maintenance margin used</dt>
							<dd>
								{crossMaintenanceMarginUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							perpCrossRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const perpCrossRate = entity.perpCrossRate}
					{#if perpCrossRate != null}
						<div>
							<dt>perp cross rate</dt>
							<dd>
								{perpCrossRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							perpAddRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const perpAddRate = entity.perpAddRate}
					{#if perpAddRate != null}
						<div>
							<dt>perp add rate</dt>
							<dd>
								{perpAddRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spotCrossRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spotCrossRate = entity.spotCrossRate}
					{#if spotCrossRate != null}
						<div>
							<dt>spot cross rate</dt>
							<dd>
								{spotCrossRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spotAddRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spotAddRate = entity.spotAddRate}
					{#if spotAddRate != null}
						<div>
							<dt>spot add rate</dt>
							<dd>
								{spotAddRate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeReferralDiscount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeReferralDiscount = entity.activeReferralDiscount}
					{#if activeReferralDiscount != null}
						<div>
							<dt>active referral discount</dt>
							<dd>
								{activeReferralDiscount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegated = entity.delegated}
					{#if delegated != null}
						<div>
							<dt>delegated</dt>
							<dd>
								{delegated}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							undelegated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const undelegated = entity.undelegated}
					{#if undelegated != null}
						<div>
							<dt>undelegated</dt>
							<dd>
								{undelegated}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalPendingWithdrawal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalPendingWithdrawal = entity.totalPendingWithdrawal}
					{#if totalPendingWithdrawal != null}
						<div>
							<dt>total pending withdrawal</dt>
							<dd>
								{totalPendingWithdrawal}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pendingWithdrawalCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingWithdrawalCount = entity.pendingWithdrawalCount}
					{#if pendingWithdrawalCount != null}
						<div>
							<dt>pending withdrawal count</dt>
							<dd>
								{pendingWithdrawalCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							abstractionMode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const abstractionMode = entity.abstractionMode}
					{#if abstractionMode != null}
						<div>
							<dt>abstraction mode</dt>
							<dd>
								{abstractionMode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dexAbstractionEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dexAbstractionEnabled = entity.dexAbstractionEnabled}
					{#if dexAbstractionEnabled != null}
						<div>
							<dt>DEX abstraction enabled</dt>
							<dd>
								{dexAbstractionEnabled}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							borrowLendHealth: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowLendHealth = entity.borrowLendHealth}
					{#if borrowLendHealth != null}
						<div>
							<dt>borrow lend health</dt>
							<dd>
								{borrowLendHealth}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							borrowLendHealthFactor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const borrowLendHealthFactor = entity.borrowLendHealthFactor}
					{#if borrowLendHealthFactor != null}
						<div>
							<dt>borrow lend health factor</dt>
							<dd>
								{borrowLendHealthFactor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
