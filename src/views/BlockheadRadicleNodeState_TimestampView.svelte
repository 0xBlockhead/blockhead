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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadRadicleNodeState_Timestamp>, 'prefetched'> = $props()

	const nodeState = $derived(selection.entitySelector.$nodeState)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRadicleNodeStateTimestamp = $derived(viewSelection({
		fields: {
			alias: true,
			nodeVersion: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/radicle/node-state/[connectionId=stringSegment]/[nodeId=stringSegment]/(blockheadRadicleNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
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
		<ResourceBoundary resource={blockheadRadicleNodeStateTimestamp}>
			{#snippet children(entity)}
				{[(entity.alias ?? ''), (entity.nodeVersion ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadRadicleNodeStateView
						selection={select(EntityType.BlockheadRadicleNodeState, selection.entitySelector.$nodeState)}
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
				resource={blockheadRadicleNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const alias = entity.alias}
					{#if alias != null}
						<div>
							<dt>alias</dt>
							<dd>
								{alias}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadRadicleNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const nodeVersion = entity.nodeVersion}
					{#if nodeVersion != null}
						<div>
							<dt>node version</dt>
							<dd>
								{nodeVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							policy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const policy = entity.policy}
					{#if policy != null}
						<div>
							<dt>policy</dt>
							<dd>
								{policy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
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

			<div>
				<dt>external addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									externalAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.externalAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
