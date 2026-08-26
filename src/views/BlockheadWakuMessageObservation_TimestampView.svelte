<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWakuMessageObservation_Timestamp>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWakuMessageObservationTimestamp = $derived(viewSelection({
		fields: {
			contentTopic: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWakuNodeStateView from '$/views/BlockheadWakuNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.messageHash || 'blockhead waku message observation timestamp')}
	href={
		href === undefined ?
			resolve(
				'/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]/(blockheadWakuNodeState)/message/[messageHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					connectionId: nodeState.connectionId,
					nodeId: nodeState.nodeId,
					messageHash: selection.entitySelector.messageHash,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWakuMessageObservationTimestamp}>
			{#snippet children(entity)}
				{@const contentTopic = entity.contentTopic}
				{#if contentTopic != null}
					<span data-text="muted">
						{contentTopic}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadWakuNodeStateView
						selection={select(EntityType.BlockheadWakuNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>message hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.messageHash} />
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pubsubTopic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pubsubTopic = entity.pubsubTopic}
					{#if pubsubTopic != null}
						<div>
							<dt>pubsub topic</dt>
							<dd>
								{pubsubTopic}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadWakuMessageObservationTimestamp}
			>
				{#snippet children(entity)}
					{@const contentTopic = entity.contentTopic}
					{#if contentTopic != null}
						<div>
							<dt>content topic</dt>
							<dd>
								{contentTopic}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							payloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadHash = entity.payloadHash}
					{#if payloadHash != null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={payloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							payloadSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadSizeBytes = entity.payloadSizeBytes}
					{#if payloadSizeBytes != null}
						<div>
							<dt>payload size bytes</dt>
							<dd>
								<NumberValue
									value={payloadSizeBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								<NumberValue
									value={version}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							ephemeral: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ephemeral = entity.ephemeral}
					{#if ephemeral != null}
						<div>
							<dt>ephemeral</dt>
							<dd>
								{ephemeral ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							senderPeerId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const senderPeerId = entity.senderPeerId}
					{#if senderPeerId != null}
						<div>
							<dt>sender peer ID</dt>
							<dd>
								{senderPeerId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							protocolPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolPath = entity.protocolPath}
					{#if protocolPath != null}
						<div>
							<dt>protocol path</dt>
							<dd>
								{protocolPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
