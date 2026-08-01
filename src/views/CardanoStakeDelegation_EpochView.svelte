<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.CardanoStakeDelegation_Epoch> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoStakeDelegation_Epoch}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano stake delegation epoch'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>stake credential</dt>
				<dd>
					<CardanoStakeCredentialView
						selection={select(EntityType.CardanoStakeCredential, selection.entitySelector.$stakeCredential)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					{selection.entitySelector.epoch}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$stakePool}
			>
				{#snippet children(cardanoStakePool)}
					{#if cardanoStakePool != null}
						<div>
							<dt>stake pool</dt>
							<dd>
								<CardanoStakePoolView
									selection={select(EntityType.CardanoStakePool, cardanoStakePool[EntityMetaKey.Selector])}
									prefetched={cardanoStakePool}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$drep}
			>
				{#snippet children(cardanoDRep)}
					{#if cardanoDRep != null}
						<div>
							<dt>drep</dt>
							<dd>
								<CardanoDRepView
									selection={select(EntityType.CardanoDRep, cardanoDRep[EntityMetaKey.Selector])}
									prefetched={cardanoDRep}
									layout={EntityLayout.Value}
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
							activeStake: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeStake = entity.activeStake}
					{#if activeStake != null}
						<div>
							<dt>active stake</dt>
							<dd>
								{activeStake}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardAmount = entity.rewardAmount}
					{#if rewardAmount != null}
						<div>
							<dt>reward amount</dt>
							<dd>
								{rewardAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawalAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawalAmount = entity.withdrawalAmount}
					{#if withdrawalAmount != null}
						<div>
							<dt>withdrawal amount</dt>
							<dd>
								{withdrawalAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registered: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registered = entity.registered}
					{#if registered != null}
						<div>
							<dt>registered</dt>
							<dd>
								{registered ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deregistered: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deregistered = entity.deregistered}
					{#if deregistered != null}
						<div>
							<dt>deregistered</dt>
							<dd>
								{deregistered ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
