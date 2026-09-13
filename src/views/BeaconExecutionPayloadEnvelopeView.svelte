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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BeaconExecutionPayloadEnvelope> = $props()

	const beaconBlock = $derived(selection.entitySelector.$beaconBlock)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconExecutionPayloadEnvelope = $derived(viewSelection({
		fields: {
			blockNumber: true,
			transactionCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconExecutionDepositRequestsView from '$/views/BeaconExecutionDepositRequestsView.svelte'
	import BeaconExecutionWithdrawalRequestsView from '$/views/BeaconExecutionWithdrawalRequestsView.svelte'
	import BeaconExecutionConsolidationRequestsView from '$/views/BeaconExecutionConsolidationRequestsView.svelte'
	import BeaconExecutionPayloadEnvelope_TimestampsView from '$/views/BeaconExecutionPayloadEnvelope_TimestampsView.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
	import BeaconExecutionPayloadBidView from '$/views/BeaconExecutionPayloadBidView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconExecutionPayloadEnvelope}
	entitySelector={selection.entitySelector}
	title={title ?? 'Execution block ' + String(prefetched.blockNumber ?? '')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/execution-payload-envelope',
				{
					network: (
						beaconBlock.$network.caip2 !== undefined ?
							caip2StringFromValue(beaconBlock.$network.caip2)
						:
							beaconBlock.$network.slug
					),
					root: beaconBlock.root,
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
		<ResourceBoundary resource={beaconExecutionPayloadEnvelope}>
			{#snippet children(entity)}
				<span>Execution block </span>
				<NumberValue
					value={entity.blockNumber}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconExecutionPayloadEnvelope}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.transactionCount}
				/>

				<span> transactions</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BeaconBlockView
				selection={select(EntityType.BeaconBlock, selection.entitySelector.$beaconBlock)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Beacon block</dt>
				<dd>
					<BeaconBlockView
						selection={select(EntityType.BeaconBlock, selection.entitySelector.$beaconBlock)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Selected bid</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$bid}
					>
						{#snippet children(beaconExecutionPayloadBid)}
							{@const beaconExecutionPayloadBidInitial = untrack(() => beaconExecutionPayloadBid)}
							<BeaconExecutionPayloadBidView
								selection={select(EntityType.BeaconExecutionPayloadBid, (beaconExecutionPayloadBid ?? beaconExecutionPayloadBidInitial)[EntityMetaKey.Selector])}
								prefetched={beaconExecutionPayloadBid ?? beaconExecutionPayloadBidInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$executionBlock}
					>
						{#snippet children(evmBlock)}
							{@const evmBlockInitial = untrack(() => evmBlock)}
							<EvmBlockView
								selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
								prefetched={evmBlock ?? evmBlockInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent execution block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentExecutionBlock}
					>
						{#snippet children(evmBlock)}
							{@const evmBlockInitial = untrack(() => evmBlock)}
							<EvmBlockView
								selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
								prefetched={evmBlock ?? evmBlockInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Builder index</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									builderIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.builderIndex}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution block number</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionPayloadEnvelope}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.blockNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Payload slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									slotNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.slotNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									executionTimestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.executionTimestampMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Fee recipient</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									feeRecipient: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.feeRecipient} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gas limit</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									gasLimit: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.gasLimit}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Gas used</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									gasUsed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.gasUsed}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Base fee per gas</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									baseFeePerGas: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.baseFeePerGas}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Blob gas used</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									blobGasUsed: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.blobGasUsed}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Excess blob gas</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									excessBlobGas: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.excessBlobGas}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Transaction count</dt>
				<dd>
					<ResourceBoundary
						resource={beaconExecutionPayloadEnvelope}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.transactionCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Block access list</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									blockAccessList: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.blockAccessList} />
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
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const depositRequestsResource = selection.$$depositRequests}
		<ResourceBoundary
			resource={depositRequestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconExecutionDepositRequestsView
						selection={depositRequestsResource}
						countResource={depositRequestsResource.count}
						title='Deposit requests'
						id='deposit-requests'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const withdrawalRequestsResource = selection.$$withdrawalRequests}
		<ResourceBoundary
			resource={withdrawalRequestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconExecutionWithdrawalRequestsView
						selection={withdrawalRequestsResource}
						countResource={withdrawalRequestsResource.count}
						title='Withdrawal requests'
						id='withdrawal-requests'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const consolidationRequestsResource = selection.$$consolidationRequests}
		<ResourceBoundary
			resource={consolidationRequestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BeaconExecutionConsolidationRequestsView
						selection={consolidationRequestsResource}
						countResource={consolidationRequestsResource.count}
						title='Consolidation requests'
						id='consolidation-requests'
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
					<BeaconExecutionPayloadEnvelope_TimestampsView
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
