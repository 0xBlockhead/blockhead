<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const beaconValidatorTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.slot) ?? '') ? 'Slot #' + String((pendingEntity.slot) ?? '') : '') || 'beacon validator timestamp')
	const viewDomId = $derived('beacon-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconValidator_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.slot ?? '')}
	href={
		href ?? (pendingEntity.$validator !== undefined && pendingEntity.$validator.$network !== undefined && pendingEntity.$validator.$network.slug !== undefined && pendingEntity.$validator.indexInNetwork !== undefined && pendingEntity.slot !== undefined && pendingEntity.source !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/observations/[slot=nonNegativeInteger]/[source=stringSegment]', {
			network: String(pendingEntity.$validator.$network.slug ?? ''),
			validatorId: String(pendingEntity.$validator.indexInNetwork ?? ''),
			slot: String(pendingEntity.slot ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.slot}
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
		{@const serialValue = pendingEntity.slot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={beaconValidatorTimestamp}>
			{#snippet Pending()}
				{@const status0 = pendingEntity.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const status0 = resolvedEntity.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									slot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const slot = pendingEntity.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slot = resolvedEntity.slot}
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
							balanceGwei: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceGwei = pendingEntity.balanceGwei}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceGwei = resolvedEntity.balanceGwei}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							effectiveBalanceGwei: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const effectiveBalanceGwei = pendingEntity.effectiveBalanceGwei}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const effectiveBalanceGwei = resolvedEntity.effectiveBalanceGwei}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = pendingEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
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
				{#snippet Pending()}
					{@const slashed = pendingEntity.slashed}
					{#if slashed !== undefined && slashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{slashed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slashed = resolvedEntity.slashed}
					{#if slashed !== undefined && slashed !== null}
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
				{#snippet Pending()}
					{@const activationEligibilityEpoch = pendingEntity.activationEligibilityEpoch}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationEligibilityEpoch = resolvedEntity.activationEligibilityEpoch}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activationEpoch = pendingEntity.activationEpoch}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activationEpoch = resolvedEntity.activationEpoch}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							exitEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const exitEpoch = pendingEntity.exitEpoch}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const exitEpoch = resolvedEntity.exitEpoch}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawableEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const withdrawableEpoch = pendingEntity.withdrawableEpoch}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawableEpoch = resolvedEntity.withdrawableEpoch}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawalCredentials: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const withdrawalCredentials = pendingEntity.withdrawalCredentials}
					{#if withdrawalCredentials !== undefined && withdrawalCredentials !== null}
						<div>
							<dt>Withdrawal credentials</dt>
							<dd>
								<TruncatedValue value={String((withdrawalCredentials) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawalCredentials = resolvedEntity.withdrawalCredentials}
					{#if withdrawalCredentials !== undefined && withdrawalCredentials !== null}
						<div>
							<dt>Withdrawal credentials</dt>
							<dd>
								<TruncatedValue value={String((withdrawalCredentials) ?? '')} />
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
				{#snippet Pending()}
					{@const finalized = pendingEntity.finalized}
					{#if finalized !== undefined && finalized !== null}
						<div>
							<dt>Finalized</dt>
							<dd>
								{finalized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalized = resolvedEntity.finalized}
					{#if finalized !== undefined && finalized !== null}
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
				{#snippet Pending()}
					{@const executionOptimistic = pendingEntity.executionOptimistic}
					{#if executionOptimistic !== undefined && executionOptimistic !== null}
						<div>
							<dt>Execution optimistic</dt>
							<dd>
								{executionOptimistic ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const executionOptimistic = resolvedEntity.executionOptimistic}
					{#if executionOptimistic !== undefined && executionOptimistic !== null}
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
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
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
						selection={select(EntityType.BeaconValidator, selection.entitySelector.$validator, {})}
						href={
							(selection.entitySelector.$validator.$network !== undefined && selection.entitySelector.$validator.$network.slug !== undefined && selection.entitySelector.$validator.indexInNetwork !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', {
								network: String(selection.entitySelector.$validator.$network.slug ?? ''),
								validatorId: String(selection.entitySelector.$validator.indexInNetwork ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
