<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.BeaconValidator_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const beaconValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.slot ?? '') ? 'Slot #' + String(pendingEntity.slot ?? '') : '') || 'beacon validator timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.slot ?? '')}
	href={
		href ?? (
			'indexInNetwork' in selection.entitySelector.$validator ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in selection.entitySelector.$validator.$network ?
								String(caip2StringFromValue(selection.entitySelector.$validator.$network.caip2))
							:
								String(selection.entitySelector.$validator.$network.slug)
						),
						validatorId: String(selection.entitySelector.$validator.indexInNetwork),
						slot: String(selection.entitySelector.slot),
						source: String(selection.entitySelector.source),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Slot </span>
			<span data-badge="small">
				#{String(pendingEntity.slot)}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.slot)}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={beaconValidatorTimestamp}>
			{#snippet children(entity)}
				{@const status0 = entity.status}
				{#if status0 != null}
					<span data-text="muted">
						{status0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue
						value={pendingEntity.slot}
					/>
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
							balanceGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceGwei = entity.balanceGwei}
					{#if balanceGwei != null}
						<div>
							<dt>Balance</dt>
							<dd>
								{String(balanceGwei)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							effectiveBalanceGwei: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const effectiveBalanceGwei = entity.effectiveBalanceGwei}
					{#if effectiveBalanceGwei != null}
						<div>
							<dt>Effective balance</dt>
							<dd>
								{String(effectiveBalanceGwei)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={beaconValidatorTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>Status</dt>
							<dd>
								{status}
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
							<dt>Slashed</dt>
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
							activationEligibilityEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activationEligibilityEpoch = entity.activationEligibilityEpoch}
					{#if activationEligibilityEpoch != null}
						<div>
							<dt>Activation eligibility epoch</dt>
							<dd>
								{String(activationEligibilityEpoch)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activationEpoch = entity.activationEpoch}
					{#if activationEpoch != null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								{String(activationEpoch)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							exitEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exitEpoch = entity.exitEpoch}
					{#if exitEpoch != null}
						<div>
							<dt>Exit epoch</dt>
							<dd>
								{String(exitEpoch)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawableEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawableEpoch = entity.withdrawableEpoch}
					{#if withdrawableEpoch != null}
						<div>
							<dt>Withdrawable epoch</dt>
							<dd>
								{String(withdrawableEpoch)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawalCredentials: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const withdrawalCredentials = entity.withdrawalCredentials}
					{#if withdrawalCredentials != null}
						<div>
							<dt>Withdrawal credentials</dt>
							<dd>
								<TruncatedValue value={withdrawalCredentials} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalized: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalized = entity.finalized}
					{#if finalized != null}
						<div>
							<dt>Finalized</dt>
							<dd>
								{finalized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							executionOptimistic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const executionOptimistic = entity.executionOptimistic}
					{#if executionOptimistic != null}
						<div>
							<dt>Execution optimistic</dt>
							<dd>
								{executionOptimistic ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Validator</dt>
				<dd>
					<BeaconValidatorView
						selection={select(EntityType.BeaconValidator, selection.entitySelector.$validator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
