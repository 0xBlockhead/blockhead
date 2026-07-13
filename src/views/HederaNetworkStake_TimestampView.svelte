<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkStake_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaNetworkStake_Timestamp>>
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
	const hederaNetworkStakeTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera network stake timestamp')
	const viewDomId = $derived('hedera-network-stake-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaNetworkView from '$/views/HederaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkStake_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNetworkStakeTimestamp}>
			{#snippet Pending()}
				{title || 'hedera network stake timestamp'}
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
				<dt>network</dt>
				<dd>
					<HederaNetworkView
						selection={select(EntityType.HederaNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							epochDay: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const epochDay = pendingEntity.epochDay}
					{#if epochDay !== undefined && epochDay !== null}
						<div>
							<dt>epoch day</dt>
							<dd>
								{String((epochDay) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const epochDay = resolvedEntity.epochDay}
					{#if epochDay !== undefined && epochDay !== null}
						<div>
							<dt>epoch day</dt>
							<dd>
								{String((epochDay) ?? '')}
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
				{#snippet Pending()}
					{@const maxStakeRewardedTinybar = pendingEntity.maxStakeRewardedTinybar}
					{#if maxStakeRewardedTinybar !== undefined && maxStakeRewardedTinybar !== null}
						<div>
							<dt>max stake rewarded tinybar</dt>
							<dd>
								{String((maxStakeRewardedTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxStakeRewardedTinybar = resolvedEntity.maxStakeRewardedTinybar}
					{#if maxStakeRewardedTinybar !== undefined && maxStakeRewardedTinybar !== null}
						<div>
							<dt>max stake rewarded tinybar</dt>
							<dd>
								{String((maxStakeRewardedTinybar) ?? '')}
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
				{#snippet Pending()}
					{@const maxStakingRewardRatePerHbar = pendingEntity.maxStakingRewardRatePerHbar}
					{#if maxStakingRewardRatePerHbar !== undefined && maxStakingRewardRatePerHbar !== null}
						<div>
							<dt>max staking reward rate per HBAR</dt>
							<dd>
								{String((maxStakingRewardRatePerHbar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxStakingRewardRatePerHbar = resolvedEntity.maxStakingRewardRatePerHbar}
					{#if maxStakingRewardRatePerHbar !== undefined && maxStakingRewardRatePerHbar !== null}
						<div>
							<dt>max staking reward rate per HBAR</dt>
							<dd>
								{String((maxStakingRewardRatePerHbar) ?? '')}
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
				{#snippet Pending()}
					{@const maxTotalRewardTinybar = pendingEntity.maxTotalRewardTinybar}
					{#if maxTotalRewardTinybar !== undefined && maxTotalRewardTinybar !== null}
						<div>
							<dt>max total reward tinybar</dt>
							<dd>
								{String((maxTotalRewardTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxTotalRewardTinybar = resolvedEntity.maxTotalRewardTinybar}
					{#if maxTotalRewardTinybar !== undefined && maxTotalRewardTinybar !== null}
						<div>
							<dt>max total reward tinybar</dt>
							<dd>
								{String((maxTotalRewardTinybar) ?? '')}
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
				{#snippet Pending()}
					{@const nodeRewardFeeFraction = pendingEntity.nodeRewardFeeFraction}
					{#if nodeRewardFeeFraction !== undefined && nodeRewardFeeFraction !== null}
						<div>
							<dt>node reward fee fraction</dt>
							<dd>
								{String((nodeRewardFeeFraction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeRewardFeeFraction = resolvedEntity.nodeRewardFeeFraction}
					{#if nodeRewardFeeFraction !== undefined && nodeRewardFeeFraction !== null}
						<div>
							<dt>node reward fee fraction</dt>
							<dd>
								{String((nodeRewardFeeFraction) ?? '')}
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
				{#snippet Pending()}
					{@const reservedStakingRewardsTinybar = pendingEntity.reservedStakingRewardsTinybar}
					{#if reservedStakingRewardsTinybar !== undefined && reservedStakingRewardsTinybar !== null}
						<div>
							<dt>reserved staking rewards tinybar</dt>
							<dd>
								{String((reservedStakingRewardsTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reservedStakingRewardsTinybar = resolvedEntity.reservedStakingRewardsTinybar}
					{#if reservedStakingRewardsTinybar !== undefined && reservedStakingRewardsTinybar !== null}
						<div>
							<dt>reserved staking rewards tinybar</dt>
							<dd>
								{String((reservedStakingRewardsTinybar) ?? '')}
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
				{#snippet Pending()}
					{@const rewardBalanceTinybar = pendingEntity.rewardBalanceTinybar}
					{#if rewardBalanceTinybar !== undefined && rewardBalanceTinybar !== null}
						<div>
							<dt>reward balance tinybar</dt>
							<dd>
								{String((rewardBalanceTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardBalanceTinybar = resolvedEntity.rewardBalanceTinybar}
					{#if rewardBalanceTinybar !== undefined && rewardBalanceTinybar !== null}
						<div>
							<dt>reward balance tinybar</dt>
							<dd>
								{String((rewardBalanceTinybar) ?? '')}
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
				{#snippet Pending()}
					{@const stakeTotalTinybar = pendingEntity.stakeTotalTinybar}
					{#if stakeTotalTinybar !== undefined && stakeTotalTinybar !== null}
						<div>
							<dt>stake total tinybar</dt>
							<dd>
								{String((stakeTotalTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeTotalTinybar = resolvedEntity.stakeTotalTinybar}
					{#if stakeTotalTinybar !== undefined && stakeTotalTinybar !== null}
						<div>
							<dt>stake total tinybar</dt>
							<dd>
								{String((stakeTotalTinybar) ?? '')}
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
				{#snippet Pending()}
					{@const stakingPeriodsStored = pendingEntity.stakingPeriodsStored}
					{#if stakingPeriodsStored !== undefined && stakingPeriodsStored !== null}
						<div>
							<dt>staking periods stored</dt>
							<dd>
								{String((stakingPeriodsStored) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakingPeriodsStored = resolvedEntity.stakingPeriodsStored}
					{#if stakingPeriodsStored !== undefined && stakingPeriodsStored !== null}
						<div>
							<dt>staking periods stored</dt>
							<dd>
								{String((stakingPeriodsStored) ?? '')}
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
				{#snippet Pending()}
					{@const stakingRewardFeeFraction = pendingEntity.stakingRewardFeeFraction}
					{#if stakingRewardFeeFraction !== undefined && stakingRewardFeeFraction !== null}
						<div>
							<dt>staking reward fee fraction</dt>
							<dd>
								{String((stakingRewardFeeFraction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakingRewardFeeFraction = resolvedEntity.stakingRewardFeeFraction}
					{#if stakingRewardFeeFraction !== undefined && stakingRewardFeeFraction !== null}
						<div>
							<dt>staking reward fee fraction</dt>
							<dd>
								{String((stakingRewardFeeFraction) ?? '')}
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
				{#snippet Pending()}
					{@const stakingStartThresholdTinybar = pendingEntity.stakingStartThresholdTinybar}
					{#if stakingStartThresholdTinybar !== undefined && stakingStartThresholdTinybar !== null}
						<div>
							<dt>staking start threshold tinybar</dt>
							<dd>
								{String((stakingStartThresholdTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakingStartThresholdTinybar = resolvedEntity.stakingStartThresholdTinybar}
					{#if stakingStartThresholdTinybar !== undefined && stakingStartThresholdTinybar !== null}
						<div>
							<dt>staking start threshold tinybar</dt>
							<dd>
								{String((stakingStartThresholdTinybar) ?? '')}
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
				{#snippet Pending()}
					{@const unreservedStakingRewardBalanceTinybar = pendingEntity.unreservedStakingRewardBalanceTinybar}
					{#if unreservedStakingRewardBalanceTinybar !== undefined && unreservedStakingRewardBalanceTinybar !== null}
						<div>
							<dt>unreserved staking reward balance tinybar</dt>
							<dd>
								{String((unreservedStakingRewardBalanceTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unreservedStakingRewardBalanceTinybar = resolvedEntity.unreservedStakingRewardBalanceTinybar}
					{#if unreservedStakingRewardBalanceTinybar !== undefined && unreservedStakingRewardBalanceTinybar !== null}
						<div>
							<dt>unreserved staking reward balance tinybar</dt>
							<dd>
								{String((unreservedStakingRewardBalanceTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
