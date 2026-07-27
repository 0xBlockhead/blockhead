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
	}: EntitySelectionViewProps<EntityType.TronNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'tron network timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TronNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tron network timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
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
							latestBlockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockHeight = entity.latestBlockHeight}
					{#if latestBlockHeight != null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{String(latestBlockHeight)}
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
							<dt>Latest block hash</dt>
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
							latestBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockTimeMs = entity.latestBlockTimeMs}
					{#if latestBlockTimeMs != null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String(latestBlockTimeMs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestBlockTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestBlockTransactionCount = entity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount != null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String(latestBlockTransactionCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							witnessCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const witnessCount = entity.witnessCount}
					{#if witnessCount != null}
						<div>
							<dt>Witness count</dt>
							<dd>
								{String(witnessCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeWitnessCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeWitnessCount = entity.activeWitnessCount}
					{#if activeWitnessCount != null}
						<div>
							<dt>Active witnesses</dt>
							<dd>
								{String(activeWitnessCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeBlockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeBlockHeight = entity.nodeBlockHeight}
					{#if nodeBlockHeight != null}
						<div>
							<dt>Node block height</dt>
							<dd>
								{String(nodeBlockHeight)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							solidityBlockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const solidityBlockHeight = entity.solidityBlockHeight}
					{#if solidityBlockHeight != null}
						<div>
							<dt>Solidity block height</dt>
							<dd>
								{String(solidityBlockHeight)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							currentPeerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentPeerCount = entity.currentPeerCount}
					{#if currentPeerCount != null}
						<div>
							<dt>Current peers</dt>
							<dd>
								{String(currentPeerCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maintenanceIntervalMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maintenanceIntervalMs = entity.maintenanceIntervalMs}
					{#if maintenanceIntervalMs != null}
						<div>
							<dt>Maintenance interval</dt>
							<dd>
								{String(maintenanceIntervalMs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionFeeSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionFeeSun = entity.transactionFeeSun}
					{#if transactionFeeSun != null}
						<div>
							<dt>Transaction fee sun</dt>
							<dd>
								{String(transactionFeeSun)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createAccountFeeSun: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createAccountFeeSun = entity.createAccountFeeSun}
					{#if createAccountFeeSun != null}
						<div>
							<dt>Create account fee sun</dt>
							<dd>
								<TruncatedValue value={String(createAccountFeeSun)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
