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
	import { select } from '$/routes/+layout.svelte'


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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
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
				{@const beaconSlotInitial = untrack(() => beaconSlot)}
				<span data-text="muted">
					<BeaconSlotView
						selection={select(EntityType.BeaconSlot, (beaconSlot ?? beaconSlotInitial)[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$slot}
					>
						{#snippet children(beaconSlot)}
							{@const beaconSlotInitial = untrack(() => beaconSlot)}
							<BeaconSlotView
								selection={select(EntityType.BeaconSlot, (beaconSlot ?? beaconSlotInitial)[EntityMetaKey.Selector])}
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
						{@const beaconBlockInitial = untrack(() => beaconBlock)}
						<div>
							<dt>Parent block</dt>
							<dd>
								<BeaconBlockView
									selection={select(EntityType.BeaconBlock, (beaconBlock ?? beaconBlockInitial)[EntityMetaKey.Selector])}
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
	{/snippet}

	{#snippet Details()}
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
