<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconValidator_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconValidator_Timestamp>>
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

	const beaconValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
			balanceGwei: true,
			effectiveBalanceGwei: true,
			slashed: true,
			activationEligibilityEpoch: true,
			activationEpoch: true,
			exitEpoch: true,
			withdrawableEpoch: true,
			withdrawalCredentials: true,
			finalized: true,
			executionOptimistic: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).slot) ?? '') ? 'Slot #' + String((({ ...selection.entitySelector, ...prefetched }).slot) ?? '') : '') || 'beacon validator timestamp')
	const viewDomId = $derived('beacon-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).slot ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]/observations/[slot=nonNegativeInteger]/[source]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$validator.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$validator.$network.caip2.reference)}`,
			validatorIndex: String(({ ...selection.entitySelector, ...prefetched }).$validator.indexInNetwork),
			slot: String(({ ...selection.entitySelector, ...prefetched }).slot),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Slot </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const status0 = prefetched.status}
			{#if status0 !== undefined && status0 !== null}
				<span data-text="muted">
					{String((status0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const status0 = prefetched.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const status0 = entity.status}
					{#if status0 !== undefined && status0 !== null}
						<span data-text="muted">
							{String((status0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary resource={beaconValidatorTimestamp}>
						{#snippet Pending()}
							{@const slot = prefetched.slot ?? selection.entitySelector.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const slot = entity.slot ?? selection.entitySelector.slot ?? prefetched.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={beaconValidatorTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const balanceGwei = prefetched.balanceGwei ?? selection.entitySelector.balanceGwei}
					{#if balanceGwei !== undefined && balanceGwei !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								{String((balanceGwei) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const balanceGwei = entity.balanceGwei ?? selection.entitySelector.balanceGwei ?? prefetched.balanceGwei}
					{#if balanceGwei !== undefined && balanceGwei !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								{String((balanceGwei) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const effectiveBalanceGwei = prefetched.effectiveBalanceGwei ?? selection.entitySelector.effectiveBalanceGwei}
					{#if effectiveBalanceGwei !== undefined && effectiveBalanceGwei !== null}
						<div>
							<dt>Effective balance</dt>
							<dd>
								{String((effectiveBalanceGwei) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const effectiveBalanceGwei = entity.effectiveBalanceGwei ?? selection.entitySelector.effectiveBalanceGwei ?? prefetched.effectiveBalanceGwei}
					{#if effectiveBalanceGwei !== undefined && effectiveBalanceGwei !== null}
						<div>
							<dt>Effective balance</dt>
							<dd>
								{String((effectiveBalanceGwei) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const slashed = prefetched.slashed ?? selection.entitySelector.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{String((slashed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const slashed = entity.slashed ?? selection.entitySelector.slashed ?? prefetched.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{String((slashed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const activationEligibilityEpoch = prefetched.activationEligibilityEpoch ?? selection.entitySelector.activationEligibilityEpoch}
					{#if activationEligibilityEpoch !== undefined && activationEligibilityEpoch !== null}
						<div>
							<dt>Activation eligibility epoch</dt>
							<dd>
								{String((activationEligibilityEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const activationEligibilityEpoch = entity.activationEligibilityEpoch ?? selection.entitySelector.activationEligibilityEpoch ?? prefetched.activationEligibilityEpoch}
					{#if activationEligibilityEpoch !== undefined && activationEligibilityEpoch !== null}
						<div>
							<dt>Activation eligibility epoch</dt>
							<dd>
								{String((activationEligibilityEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const activationEpoch = prefetched.activationEpoch ?? selection.entitySelector.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								{String((activationEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const activationEpoch = entity.activationEpoch ?? selection.entitySelector.activationEpoch ?? prefetched.activationEpoch}
					{#if activationEpoch !== undefined && activationEpoch !== null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								{String((activationEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const exitEpoch = prefetched.exitEpoch ?? selection.entitySelector.exitEpoch}
					{#if exitEpoch !== undefined && exitEpoch !== null}
						<div>
							<dt>Exit epoch</dt>
							<dd>
								{String((exitEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const exitEpoch = entity.exitEpoch ?? selection.entitySelector.exitEpoch ?? prefetched.exitEpoch}
					{#if exitEpoch !== undefined && exitEpoch !== null}
						<div>
							<dt>Exit epoch</dt>
							<dd>
								{String((exitEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const withdrawableEpoch = prefetched.withdrawableEpoch ?? selection.entitySelector.withdrawableEpoch}
					{#if withdrawableEpoch !== undefined && withdrawableEpoch !== null}
						<div>
							<dt>Withdrawable epoch</dt>
							<dd>
								{String((withdrawableEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const withdrawableEpoch = entity.withdrawableEpoch ?? selection.entitySelector.withdrawableEpoch ?? prefetched.withdrawableEpoch}
					{#if withdrawableEpoch !== undefined && withdrawableEpoch !== null}
						<div>
							<dt>Withdrawable epoch</dt>
							<dd>
								{String((withdrawableEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const withdrawalCredentials = prefetched.withdrawalCredentials ?? selection.entitySelector.withdrawalCredentials}
					{#if withdrawalCredentials !== undefined && withdrawalCredentials !== null}
						<div>
							<dt>Withdrawal credentials</dt>
							<dd>
								{String((withdrawalCredentials) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const withdrawalCredentials = entity.withdrawalCredentials ?? selection.entitySelector.withdrawalCredentials ?? prefetched.withdrawalCredentials}
					{#if withdrawalCredentials !== undefined && withdrawalCredentials !== null}
						<div>
							<dt>Withdrawal credentials</dt>
							<dd>
								{String((withdrawalCredentials) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const finalized = prefetched.finalized ?? selection.entitySelector.finalized}
					{#if finalized !== undefined && finalized !== null}
						<div>
							<dt>Finalized</dt>
							<dd>
								{String((finalized) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const finalized = entity.finalized ?? selection.entitySelector.finalized ?? prefetched.finalized}
					{#if finalized !== undefined && finalized !== null}
						<div>
							<dt>Finalized</dt>
							<dd>
								{String((finalized) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const executionOptimistic = prefetched.executionOptimistic ?? selection.entitySelector.executionOptimistic}
					{#if executionOptimistic !== undefined && executionOptimistic !== null}
						<div>
							<dt>Execution optimistic</dt>
							<dd>
								{String((executionOptimistic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const executionOptimistic = entity.executionOptimistic ?? selection.entitySelector.executionOptimistic ?? prefetched.executionOptimistic}
					{#if executionOptimistic !== undefined && executionOptimistic !== null}
						<div>
							<dt>Execution optimistic</dt>
							<dd>
								{String((executionOptimistic) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={beaconValidatorTimestamp}>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								{String((timestampMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								{String((timestampMs) ?? '')}
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
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]', {
								caip2: `${String(selection.entitySelector.$validator.caip2.namespace)}:${String(selection.entitySelector.$validator.caip2.reference)}`,
								validatorIndex: String(selection.entitySelector.$validator.indexInNetwork),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
