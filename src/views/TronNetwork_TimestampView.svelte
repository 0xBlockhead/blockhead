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
	}: Omit<EntitySelectionViewProps<EntityType.TronNetwork_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TronNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
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
								{latestBlockHeight}
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
								{latestBlockTimeMs}
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
								{latestBlockTransactionCount}
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
								{witnessCount}
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
								{activeWitnessCount}
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
								{nodeBlockHeight}
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
								{solidityBlockHeight}
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
								{currentPeerCount}
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
								{maintenanceIntervalMs}
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
								{transactionFeeSun}
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
								{createAccountFeeSun}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
