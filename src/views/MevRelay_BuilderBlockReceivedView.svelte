<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.MevRelay_BuilderBlockReceived> = $props()

	const network = $derived(selection.entitySelector.$network)
	const mevRelayBuilderBlockReceived = $derived(selection({
		fields: {
			valueWei: true,
		},
	}))
	const titleFallback = $derived(['Slot ' + String(selection.entitySelector.slot), (prefetched.valueWei != null ? String(prefetched.valueWei) + ' wei' : '')].filter(Boolean).join(' ') || 'MEV relay builder block received')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevBuilderView from '$/views/MevBuilderView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_BuilderBlockReceived}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/received-bid/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]/[builderPubkey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					relayHost: selection.entitySelector.relayHost,
					slot: String(selection.entitySelector.slot),
					blockHash: selection.entitySelector.blockHash,
					builderPubkey: selection.entitySelector.builderPubkey,
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
		<ResourceBoundary resource={mevRelayBuilderBlockReceived}>
			{#snippet children(entity)}
				{['Slot ' + String(selection.entitySelector.slot), (entity.valueWei != null ? String(entity.valueWei) + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelayBuilderBlockReceived}>
			{#snippet children(entity)}
				{@const valueWei = entity.valueWei}
				{#if valueWei != null}
					<NumberValue
						value={valueWei}
					/>

					<span> wei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$builder}
		>
			{#snippet children(mevBuilder)}
				{@const mevBuilderInitial = untrack(() => mevBuilder)}
				<span data-text="muted">
					<MevBuilderView
						selection={select(EntityType.MevBuilder, (mevBuilder ?? mevBuilderInitial)[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Relay host</dt>
				<dd>
					{selection.entitySelector.relayHost}
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.slot}
					/>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.blockHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentHash = entity.parentHash}
					{#if parentHash != null}
						<div>
							<dt>Parent hash</dt>
							<dd>
								<TruncatedValue value={parentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Builder public key</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.builderPubkey} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proposerPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposerPubkey = entity.proposerPubkey}
					{#if proposerPubkey != null}
						<div>
							<dt>Proposer public key</dt>
							<dd>
								<TruncatedValue value={proposerPubkey} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proposerFeeRecipient: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposerFeeRecipient = entity.proposerFeeRecipient}
					{#if proposerFeeRecipient != null}
						<div>
							<dt>Proposer fee recipient</dt>
							<dd>
								<TruncatedValue value={proposerFeeRecipient} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Builder</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$builder}
					>
						{#snippet children(mevBuilder)}
							{@const mevBuilderInitial = untrack(() => mevBuilder)}
							<MevBuilderView
								selection={select(EntityType.MevBuilder, (mevBuilder ?? mevBuilderInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={mevRelayBuilderBlockReceived}
			>
				{#snippet children(entity)}
					{@const valueWei = entity.valueWei}
					{#if valueWei != null}
						<div>
							<dt>Bid value</dt>
							<dd>
								<NumberValue
									value={valueWei}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasLimit = entity.gasLimit}
					{#if gasLimit != null}
						<div>
							<dt>Gas limit</dt>
							<dd>
								<NumberValue
									value={gasLimit}
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
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
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
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								<NumberValue
									value={transactionCount}
								/>
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
				resource={
					selection({
						fields: {
							receivedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedAtMs = entity.receivedAtMs}
					{#if receivedAtMs != null}
						<div>
							<dt>Received at</dt>
							<dd>
								<Timestamp timestamp={receivedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							optimisticSubmission: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const optimisticSubmission = entity.optimisticSubmission}
					{#if optimisticSubmission != null}
						<div>
							<dt>Optimistic submission</dt>
							<dd>
								{optimisticSubmission ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
