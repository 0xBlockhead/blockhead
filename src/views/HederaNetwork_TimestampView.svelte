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

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'hedera network timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
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
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
								{String(latestBlockNumber)}
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
								{String(latestTransactionCount)}
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
								<TruncatedValue value={String(accountCount)} />
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
								{String(tokenCount)}
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
								{String(topicCount)}
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
								{String(contractCount)}
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
								{String(mirrorNodeLagMs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
