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
	}: EntitySelectionViewProps<EntityType.TonNetwork_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TonNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON network timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON network timestamp
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
							masterchainSeqno: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const masterchainSeqno = entity.masterchainSeqno}
					{#if masterchainSeqno != null}
						<div>
							<dt>masterchain seqno</dt>
							<dd>
								{masterchainSeqno}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shardCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const shardCount = entity.shardCount}
					{#if shardCount != null}
						<div>
							<dt>shard count</dt>
							<dd>
								{shardCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validatorCount = entity.validatorCount}
					{#if validatorCount != null}
						<div>
							<dt>validator count</dt>
							<dd>
								{validatorCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockUtimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockUtimeMs = entity.latestBlockUtimeMs}
					{#if latestBlockUtimeMs != null}
						<div>
							<dt>latest block utime ms</dt>
							<dd>
								{latestBlockUtimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexerLagMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexerLagMs = entity.indexerLagMs}
					{#if indexerLagMs != null}
						<div>
							<dt>indexer lag ms</dt>
							<dd>
								{indexerLagMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							health: true,
						},
					})
				}
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
		</dl>
	{/snippet}
</EntityView>
