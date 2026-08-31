<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BeaconBlock>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconBlock = $derived(viewSelection({
		fields: {
			version: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.root || 'beacon block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconDepositsView from '$/views/BeaconDepositsView.svelte'
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
	import BeaconBlock_TimestampsView from '$/views/BeaconBlock_TimestampsView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import BeaconExecutionPayloadBidView from '$/views/BeaconExecutionPayloadBidView.svelte'
	import BeaconExecutionPayloadEnvelopeView from '$/views/BeaconExecutionPayloadEnvelopeView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					root: selection.entitySelector.root,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.root} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconBlock}>
			{#snippet children(entity)}
				{entity.version || selection.entitySelector.root || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$slot}
		>
			{#snippet children(beaconSlot)}
				<span data-text="muted">
					<BeaconSlotView
						selection={select(EntityType.BeaconSlot, beaconSlot[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$slot}
					>
						{#snippet children(beaconSlot)}
							<BeaconSlotView
								selection={select(EntityType.BeaconSlot, beaconSlot[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Proposer</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$proposer}
					>
						{#snippet children(beaconValidator)}
							{@const beaconValidatorInitial = untrack(() => beaconValidator)}
							<BeaconValidatorView
								selection={select(EntityType.BeaconValidator, (beaconValidator ?? beaconValidatorInitial)[EntityMetaKey.Selector])}
								prefetched={beaconValidator ?? beaconValidatorInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(beaconBlock)}
					{#if beaconBlock != null}
						<div>
							<dt>Parent block</dt>
							<dd>
								<BeaconBlockView
									selection={select(EntityType.BeaconBlock, beaconBlock[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Fork version</dt>
				<dd>
					<ResourceBoundary
						resource={beaconBlock}
					>
						{#snippet children(entity)}
							{entity.version}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block root</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.root} />
				</dd>
			</div>

			<div>
				<dt>State root</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									stateRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.stateRoot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Body root</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									bodyRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.bodyRoot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									signature: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signature} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$executionBlock}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						{@const evmBlockInitial = untrack(() => evmBlock)}
						<div>
							<dt>Execution block</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
									prefetched={evmBlock ?? evmBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$executionPayloadBid}
			>
				{#snippet children(beaconExecutionPayloadBid)}
					{#if beaconExecutionPayloadBid != null}
						{@const beaconExecutionPayloadBidInitial = untrack(() => beaconExecutionPayloadBid)}
						<div>
							<dt>Selected execution payload bid</dt>
							<dd>
								<BeaconExecutionPayloadBidView
									selection={select(EntityType.BeaconExecutionPayloadBid, (beaconExecutionPayloadBid ?? beaconExecutionPayloadBidInitial)[EntityMetaKey.Selector])}
									prefetched={beaconExecutionPayloadBid ?? beaconExecutionPayloadBidInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$executionPayloadEnvelope}
			>
				{#snippet children(beaconExecutionPayloadEnvelope)}
					{#if beaconExecutionPayloadEnvelope != null}
						{@const beaconExecutionPayloadEnvelopeInitial = untrack(() => beaconExecutionPayloadEnvelope)}
						<div>
							<dt>Delivered execution payload envelope</dt>
							<dd>
								<BeaconExecutionPayloadEnvelopeView
									selection={select(EntityType.BeaconExecutionPayloadEnvelope, (beaconExecutionPayloadEnvelope ?? beaconExecutionPayloadEnvelopeInitial)[EntityMetaKey.Selector])}
									prefetched={beaconExecutionPayloadEnvelope ?? beaconExecutionPayloadEnvelopeInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								rewardTotalGwei: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const rewardTotalGwei = entity.rewardTotalGwei}
						{#if rewardTotalGwei != null}
							<div>
								<dt>Total proposer reward</dt>
								<dd>
									<NumberValue
										value={rewardTotalGwei}
									/>

									<span> gwei</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								rewardAttestationsGwei: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const rewardAttestationsGwei = entity.rewardAttestationsGwei}
						{#if rewardAttestationsGwei != null}
							<div>
								<dt>Attestation reward</dt>
								<dd>
									<NumberValue
										value={rewardAttestationsGwei}
									/>

									<span> gwei</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								rewardSyncAggregateGwei: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const rewardSyncAggregateGwei = entity.rewardSyncAggregateGwei}
						{#if rewardSyncAggregateGwei != null}
							<div>
								<dt>Sync aggregate reward</dt>
								<dd>
									<NumberValue
										value={rewardSyncAggregateGwei}
									/>

									<span> gwei</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								rewardProposerSlashingsGwei: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const rewardProposerSlashingsGwei = entity.rewardProposerSlashingsGwei}
						{#if rewardProposerSlashingsGwei != null}
							<div>
								<dt>Proposer slashing reward</dt>
								<dd>
									<NumberValue
										value={rewardProposerSlashingsGwei}
									/>

									<span> gwei</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								rewardAttesterSlashingsGwei: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const rewardAttesterSlashingsGwei = entity.rewardAttesterSlashingsGwei}
						{#if rewardAttesterSlashingsGwei != null}
							<div>
								<dt>Attester slashing reward</dt>
								<dd>
									<NumberValue
										value={rewardAttesterSlashingsGwei}
									/>

									<span> gwei</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const depositsResource = selection.$$deposits}
		<ResourceBoundary
			resource={depositsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconDepositsView
						selection={depositsResource}
						countResource={depositsResource.count}
						title='Deposits'
						id='deposits'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const attestationsResource = selection.$$attestations}
		<ResourceBoundary
			resource={attestationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconAttestationsView
						selection={attestationsResource}
						countResource={attestationsResource.count}
						title='Attestations'
						id='attestations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const withdrawalsResource = selection.$$withdrawals}
		<ResourceBoundary
			resource={withdrawalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconWithdrawalsView
						selection={withdrawalsResource}
						countResource={withdrawalsResource.count}
						title='Withdrawals'
						id='withdrawals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const slashingsResource = selection.$$slashings}
		<ResourceBoundary
			resource={slashingsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconSlashingsView
						selection={slashingsResource}
						countResource={slashingsResource.count}
						title='Slashings'
						id='slashings'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconBlock_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
