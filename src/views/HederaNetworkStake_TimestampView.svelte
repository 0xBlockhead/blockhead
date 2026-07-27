<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaNetworkStake_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hedera network stake timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkStake_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hedera network stake timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epochDay: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochDay = entity.epochDay}
					{#if epochDay != null}
						<div>
							<dt>epoch day</dt>
							<dd>
								{String(epochDay)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxStakeRewardedTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxStakeRewardedTinybar = entity.maxStakeRewardedTinybar}
					{#if maxStakeRewardedTinybar != null}
						<div>
							<dt>max stake rewarded tinybar</dt>
							<dd>
								{String(maxStakeRewardedTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxStakingRewardRatePerHbar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxStakingRewardRatePerHbar = entity.maxStakingRewardRatePerHbar}
					{#if maxStakingRewardRatePerHbar != null}
						<div>
							<dt>max staking reward rate per HBAR</dt>
							<dd>
								{String(maxStakingRewardRatePerHbar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxTotalRewardTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxTotalRewardTinybar = entity.maxTotalRewardTinybar}
					{#if maxTotalRewardTinybar != null}
						<div>
							<dt>max total reward tinybar</dt>
							<dd>
								{String(maxTotalRewardTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeRewardFeeFraction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeRewardFeeFraction = entity.nodeRewardFeeFraction}
					{#if nodeRewardFeeFraction != null}
						<div>
							<dt>node reward fee fraction</dt>
							<dd>
								{String(nodeRewardFeeFraction)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reservedStakingRewardsTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reservedStakingRewardsTinybar = entity.reservedStakingRewardsTinybar}
					{#if reservedStakingRewardsTinybar != null}
						<div>
							<dt>reserved staking rewards tinybar</dt>
							<dd>
								{String(reservedStakingRewardsTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardBalanceTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardBalanceTinybar = entity.rewardBalanceTinybar}
					{#if rewardBalanceTinybar != null}
						<div>
							<dt>reward balance tinybar</dt>
							<dd>
								{String(rewardBalanceTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeTotalTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakeTotalTinybar = entity.stakeTotalTinybar}
					{#if stakeTotalTinybar != null}
						<div>
							<dt>stake total tinybar</dt>
							<dd>
								{String(stakeTotalTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakingPeriodsStored: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakingPeriodsStored = entity.stakingPeriodsStored}
					{#if stakingPeriodsStored != null}
						<div>
							<dt>staking periods stored</dt>
							<dd>
								{String(stakingPeriodsStored)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakingRewardFeeFraction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakingRewardFeeFraction = entity.stakingRewardFeeFraction}
					{#if stakingRewardFeeFraction != null}
						<div>
							<dt>staking reward fee fraction</dt>
							<dd>
								{String(stakingRewardFeeFraction)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakingStartThresholdTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakingStartThresholdTinybar = entity.stakingStartThresholdTinybar}
					{#if stakingStartThresholdTinybar != null}
						<div>
							<dt>staking start threshold tinybar</dt>
							<dd>
								{String(stakingStartThresholdTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unreservedStakingRewardBalanceTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unreservedStakingRewardBalanceTinybar = entity.unreservedStakingRewardBalanceTinybar}
					{#if unreservedStakingRewardBalanceTinybar != null}
						<div>
							<dt>unreserved staking reward balance tinybar</dt>
							<dd>
								{String(unreservedStakingRewardBalanceTinybar)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
