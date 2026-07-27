<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.ArweaveNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const arweaveNetworkTimestamp = $derived(selection({
		fields: {
			latestHeight: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'arweave network timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ArweaveNetworkView from '$/views/ArweaveNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ArweaveNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={arweaveNetworkTimestamp}>
			{#snippet children(entity)}
				{@const latestHeight0 = entity.latestHeight}
				{#if latestHeight0 != null}
					<NumberValue
						value={latestHeight0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={arweaveNetworkTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{pendingEntity.source}
				</span>
				{@const reachable1 = entity.reachable}
				{#if reachable1 != null}
					<span data-text="muted">
						{reachable1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<ArweaveNetworkView
						selection={select(EntityType.ArweaveNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={arweaveNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const latestHeight = entity.latestHeight}
					{#if latestHeight != null}
						<div>
							<dt>latest height</dt>
							<dd>
								<NumberValue
									value={latestHeight}
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
		</dl>

		<dl data-column-item="center">
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
								<NumberValue
									value={queuedTransactionCount}
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
				resource={arweaveNetworkTimestamp}
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
