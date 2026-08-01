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
	}: EntitySelectionViewProps<EntityType.AvalancheDelegator> = $props()

	const avalancheDelegator = $derived(selection({
		fields: {
			delegatorAddress: true,
			stakeAmountNavax: true,
		},
	}))
	const titleFallback = $derived((prefetched.delegatorAddress ?? '') || selection.entitySelector.txId || 'avalanche delegator')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheValidatorView from '$/views/AvalancheValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheDelegator}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalancheDelegator}>
			{#snippet children(entity)}
				{(entity.delegatorAddress ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheDelegator}>
			{#snippet children(entity)}
				{@const stakeAmountNavax = entity.stakeAmountNavax}
				{#if stakeAmountNavax != null}
					<NumberValue
						value={stakeAmountNavax}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>validator</dt>
				<dd>
					<AvalancheValidatorView
						selection={select(EntityType.AvalancheValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={avalancheDelegator}
			>
				{#snippet children(entity)}
					{@const delegatorAddress = entity.delegatorAddress}
					{#if delegatorAddress != null}
						<div>
							<dt>delegator address</dt>
							<dd>
								<TruncatedValue value={delegatorAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={avalancheDelegator}
			>
				{#snippet children(entity)}
					{@const stakeAmountNavax = entity.stakeAmountNavax}
					{#if stakeAmountNavax != null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue
									value={stakeAmountNavax}
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
							potentialRewardNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const potentialRewardNavax = entity.potentialRewardNavax}
					{#if potentialRewardNavax != null}
						<div>
							<dt>potential reward navax</dt>
							<dd>
								<NumberValue
									value={potentialRewardNavax}
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
							startTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startTimeMs = entity.startTimeMs}
					{#if startTimeMs != null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={startTimeMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endTimeMs = entity.endTimeMs}
					{#if endTimeMs != null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={endTimeMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
