<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadLogosBlockchainNodeState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LogosBlockchainNode_Rest,
		],
	}))
	const blockheadLogosBlockchainNodeStateTimestamp = $derived(viewSelection({
		fields: {
			peerCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLogosBlockchainNodeStateView from '$/views/BlockheadLogosBlockchainNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLogosBlockchainNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const peerCount = entity.peerCount}
				{#if peerCount != null}
					<NumberValue
						value={peerCount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadLogosBlockchainNodeStateView
						selection={select(EntityType.BlockheadLogosBlockchainNodeState, selection.entitySelector.$nodeState)}
						layout={EntityLayout.Value}
						open={false}
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

			<div>
				<dt>listen addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									listenAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.listenAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadLogosBlockchainNodeStateTimestamp}
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							connectionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const connectionCount = entity.connectionCount}
					{#if connectionCount != null}
						<div>
							<dt>connection count</dt>
							<dd>
								<NumberValue
									value={connectionCount}
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
							pendingConnectionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingConnectionCount = entity.pendingConnectionCount}
					{#if pendingConnectionCount != null}
						<div>
							<dt>pending connection count</dt>
							<dd>
								<NumberValue
									value={pendingConnectionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
