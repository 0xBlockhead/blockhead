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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWakuNodeState_Timestamp>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWakuNodeStateTimestamp = $derived(viewSelection({
		fields: {
			health: true,
			peerCount: true,
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
	entityType={EntityType.BlockheadWakuNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/waku/connection/[connectionId=stringSegment]/node-state/[nodeId=stringSegment]/(blockheadWakuNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					connectionId: nodeState.connectionId,
					nodeId: nodeState.nodeId,
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
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWakuNodeStateTimestamp}>
			{#snippet children(entity)}
				{(entity.health ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWakuNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const peerCount = entity.peerCount}
				{#if peerCount != null}
					<span data-text="muted">
						<NumberValue
							value={peerCount}
						/>
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
				resource={blockheadWakuNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const health = entity.health}
					{#if health != null}
						<div>
							<dt>health</dt>
							<dd>
								{health}
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
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadWakuNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue
									value={peerCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>listen addresses</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.listenAddresses}
					>
						{#snippet children(listenAddresses)}
							{listenAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							enrUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enrUri = entity.enrUri}
					{#if enrUri != null}
						<div>
							<dt>ENR URI</dt>
							<dd>
								<a
									href={enrUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={enrUri} />
								</a>
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
							relayEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const relayEnabled = entity.relayEnabled}
					{#if relayEnabled != null}
						<div>
							<dt>relay enabled</dt>
							<dd>
								{relayEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							storeEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storeEnabled = entity.storeEnabled}
					{#if storeEnabled != null}
						<div>
							<dt>store enabled</dt>
							<dd>
								{storeEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							filterEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const filterEnabled = entity.filterEnabled}
					{#if filterEnabled != null}
						<div>
							<dt>filter enabled</dt>
							<dd>
								{filterEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lightpushEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lightpushEnabled = entity.lightpushEnabled}
					{#if lightpushEnabled != null}
						<div>
							<dt>lightpush enabled</dt>
							<dd>
								{lightpushEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rlnRelayEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rlnRelayEnabled = entity.rlnRelayEnabled}
					{#if rlnRelayEnabled != null}
						<div>
							<dt>RLN relay enabled</dt>
							<dd>
								{rlnRelayEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>subscribed pubsub topics</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.subscribedPubsubTopics}
					>
						{#snippet children(subscribedPubsubTopics)}
							{subscribedPubsubTopics.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>subscribed content topics</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.subscribedContentTopics}
					>
						{#snippet children(subscribedContentTopics)}
							{subscribedContentTopics.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
