<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ArweaveNetwork_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveNetworkView from '$/views/ArweaveNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ArweaveNetworkView
						selection={select(EntityType.ArweaveNetwork, selection.entitySelector.$network)}
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
				resource={
					selection({
						fields: {
							latestHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestHeight = entity.latestHeight}
					{#if latestHeight != null}
						<div>
							<dt>latest height</dt>
							<dd>
								{latestHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockHash = entity.latestBlockHash}
					{#if latestBlockHash != null}
						<div>
							<dt>latest block hash</dt>
							<dd>
								<TruncatedValue value={latestBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							currentBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentBlockHash = entity.currentBlockHash}
					{#if currentBlockHash != null}
						<div>
							<dt>current block hash</dt>
							<dd>
								<TruncatedValue value={currentBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							networkId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkId = entity.networkId}
					{#if networkId != null}
						<div>
							<dt>network ID</dt>
							<dd>
								{networkId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							peerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>peer count</dt>
							<dd>
								{peerCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							queuedTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const queuedTransactionCount = entity.queuedTransactionCount}
					{#if queuedTransactionCount != null}
						<div>
							<dt>queued transaction count</dt>
							<dd>
								{queuedTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gatewayOrigin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gatewayOrigin = entity.gatewayOrigin}
					{#if gatewayOrigin != null}
						<div>
							<dt>gateway origin</dt>
							<dd>
								{gatewayOrigin}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							graphqlCursor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const graphqlCursor = entity.graphqlCursor}
					{#if graphqlCursor != null}
						<div>
							<dt>GraphQL cursor</dt>
							<dd>
								{graphqlCursor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
