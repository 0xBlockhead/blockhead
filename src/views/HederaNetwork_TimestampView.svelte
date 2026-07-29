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
	}: EntitySelectionViewProps<EntityType.HederaNetwork_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'hedera network timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hedera network timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestConsensusTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestConsensusTimestamp = entity.latestConsensusTimestamp}
					{#if latestConsensusTimestamp != null}
						<div>
							<dt>latest consensus timestamp</dt>
							<dd>
								{latestConsensusTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockNumber = entity.latestBlockNumber}
					{#if latestBlockNumber != null}
						<div>
							<dt>latest block number</dt>
							<dd>
								{latestBlockNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestTransactionCount = entity.latestTransactionCount}
					{#if latestTransactionCount != null}
						<div>
							<dt>latest transaction count</dt>
							<dd>
								{latestTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountCount = entity.accountCount}
					{#if accountCount != null}
						<div>
							<dt>account count</dt>
							<dd>
								{accountCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenCount = entity.tokenCount}
					{#if tokenCount != null}
						<div>
							<dt>token count</dt>
							<dd>
								{tokenCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							topicCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const topicCount = entity.topicCount}
					{#if topicCount != null}
						<div>
							<dt>topic count</dt>
							<dd>
								{topicCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractCount = entity.contractCount}
					{#if contractCount != null}
						<div>
							<dt>contract count</dt>
							<dd>
								{contractCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mirrorNodeLagMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mirrorNodeLagMs = entity.mirrorNodeLagMs}
					{#if mirrorNodeLagMs != null}
						<div>
							<dt>mirror node lag ms</dt>
							<dd>
								{mirrorNodeLagMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
