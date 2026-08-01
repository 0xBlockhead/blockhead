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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosBaker_Cycle_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBaker_Cycle_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>baker</dt>
				<dd>
					<TezosBakerView
						selection={select(EntityType.TezosBaker, selection.entitySelector.$baker)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>cycle</dt>
				<dd>
					{selection.entitySelector.cycle}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							snapshotLevel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const snapshotLevel = entity.snapshotLevel}
					{#if snapshotLevel != null}
						<div>
							<dt>snapshot level</dt>
							<dd>
								{snapshotLevel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakingBalanceMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stakingBalanceMutez = entity.stakingBalanceMutez}
					{#if stakingBalanceMutez != null}
						<div>
							<dt>staking balance mutez</dt>
							<dd>
								{stakingBalanceMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatedBalanceMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatedBalanceMutez = entity.delegatedBalanceMutez}
					{#if delegatedBalanceMutez != null}
						<div>
							<dt>delegated balance mutez</dt>
							<dd>
								{delegatedBalanceMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expectedBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expectedBlocks = entity.expectedBlocks}
					{#if expectedBlocks != null}
						<div>
							<dt>expected blocks</dt>
							<dd>
								{expectedBlocks}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							producedBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const producedBlocks = entity.producedBlocks}
					{#if producedBlocks != null}
						<div>
							<dt>produced blocks</dt>
							<dd>
								{producedBlocks}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							missedBlocks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const missedBlocks = entity.missedBlocks}
					{#if missedBlocks != null}
						<div>
							<dt>missed blocks</dt>
							<dd>
								{missedBlocks}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expectedEndorsements: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expectedEndorsements = entity.expectedEndorsements}
					{#if expectedEndorsements != null}
						<div>
							<dt>expected endorsements</dt>
							<dd>
								{expectedEndorsements}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							missedEndorsements: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const missedEndorsements = entity.missedEndorsements}
					{#if missedEndorsements != null}
						<div>
							<dt>missed endorsements</dt>
							<dd>
								{missedEndorsements}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardsMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardsMutez = entity.rewardsMutez}
					{#if rewardsMutez != null}
						<div>
							<dt>rewards mutez</dt>
							<dd>
								{rewardsMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feesMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feesMutez = entity.feesMutez}
					{#if feesMutez != null}
						<div>
							<dt>fees mutez</dt>
							<dd>
								{feesMutez}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
