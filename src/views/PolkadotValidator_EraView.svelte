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
	}: EntitySelectionViewProps<EntityType.PolkadotValidator_Era> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const polkadotValidatorEra = $derived(selection({
		fields: {
			active: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.eraIndex ?? '') || 'polkadot validator era')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotValidatorView from '$/views/PolkadotValidatorView.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotValidator_Era}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{String(pendingEntity.eraIndex ?? '') || 'polkadot validator era'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={polkadotValidatorEra}>
			{#snippet children(entity)}
				{String(entity.active ?? '') || String(pendingEntity.eraIndex) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<PolkadotValidatorView
						selection={select(EntityType.PolkadotValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>era index</dt>
				<dd>
					{String(pendingEntity.eraIndex)}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$controller}
			>
				{#snippet children(polkadotAccount)}
					{#if polkadotAccount != null}
						<div>
							<dt>controller</dt>
							<dd>
								<PolkadotAccountView
									selection={select(EntityType.PolkadotAccount, polkadotAccount[EntityMetaKey.Selector])}
									prefetched={polkadotAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={polkadotValidatorEra}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slashed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slashed = entity.slashed}
					{#if slashed != null}
						<div>
							<dt>slashed</dt>
							<dd>
								{slashed ? 'Yes' : 'No'}
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
						fields: {
							commissionPerBillion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const commissionPerBillion = entity.commissionPerBillion}
					{#if commissionPerBillion != null}
						<div>
							<dt>commission per billion</dt>
							<dd>
								{String(commissionPerBillion)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalStakePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalStakePlancks = entity.totalStakePlancks}
					{#if totalStakePlancks != null}
						<div>
							<dt>total stake plancks</dt>
							<dd>
								{String(totalStakePlancks)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownStakePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ownStakePlancks = entity.ownStakePlancks}
					{#if ownStakePlancks != null}
						<div>
							<dt>own stake plancks</dt>
							<dd>
								{String(ownStakePlancks)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nominatorStakePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nominatorStakePlancks = entity.nominatorStakePlancks}
					{#if nominatorStakePlancks != null}
						<div>
							<dt>nominator stake plancks</dt>
							<dd>
								{String(nominatorStakePlancks)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nominatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nominatorCount = entity.nominatorCount}
					{#if nominatorCount != null}
						<div>
							<dt>nominator count</dt>
							<dd>
								{String(nominatorCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardPoints: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardPoints = entity.rewardPoints}
					{#if rewardPoints != null}
						<div>
							<dt>reward points</dt>
							<dd>
								{String(rewardPoints)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
