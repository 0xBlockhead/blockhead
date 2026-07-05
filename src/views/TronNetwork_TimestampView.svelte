<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TronNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TronNetwork_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const tronNetworkTimestamp = $derived(selection({}))
	const titleFallback = $derived('tron network timestamp')
	const viewDomId = $derived('tron-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TronNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tronNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'tron network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							latestBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHeight = prefetched.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{String((latestBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHeight = resolvedEntity.latestBlockHeight}
					{#if latestBlockHeight !== undefined && latestBlockHeight !== null}
						<div>
							<dt>Latest block height</dt>
							<dd>
								{String((latestBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							latestBlockHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockHash = prefetched.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockHash = resolvedEntity.latestBlockHash}
					{#if latestBlockHash !== undefined && latestBlockHash !== null}
						<div>
							<dt>Latest block hash</dt>
							<dd>
								<TruncatedValue value={String((latestBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							latestBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockTimeMs = prefetched.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockTimeMs = resolvedEntity.latestBlockTimeMs}
					{#if latestBlockTimeMs !== undefined && latestBlockTimeMs !== null}
						<div>
							<dt>Latest block time</dt>
							<dd>
								{String((latestBlockTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							latestBlockTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestBlockTransactionCount = prefetched.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestBlockTransactionCount = resolvedEntity.latestBlockTransactionCount}
					{#if latestBlockTransactionCount !== undefined && latestBlockTransactionCount !== null}
						<div>
							<dt>Latest block transactions</dt>
							<dd>
								{String((latestBlockTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							witnessCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const witnessCount = prefetched.witnessCount}
					{#if witnessCount !== undefined && witnessCount !== null}
						<div>
							<dt>Witness count</dt>
							<dd>
								{String((witnessCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const witnessCount = resolvedEntity.witnessCount}
					{#if witnessCount !== undefined && witnessCount !== null}
						<div>
							<dt>Witness count</dt>
							<dd>
								{String((witnessCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							activeWitnessCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activeWitnessCount = prefetched.activeWitnessCount}
					{#if activeWitnessCount !== undefined && activeWitnessCount !== null}
						<div>
							<dt>Active witnesses</dt>
							<dd>
								{String((activeWitnessCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeWitnessCount = resolvedEntity.activeWitnessCount}
					{#if activeWitnessCount !== undefined && activeWitnessCount !== null}
						<div>
							<dt>Active witnesses</dt>
							<dd>
								{String((activeWitnessCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							nodeBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeBlockHeight = prefetched.nodeBlockHeight}
					{#if nodeBlockHeight !== undefined && nodeBlockHeight !== null}
						<div>
							<dt>Node block height</dt>
							<dd>
								{String((nodeBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeBlockHeight = resolvedEntity.nodeBlockHeight}
					{#if nodeBlockHeight !== undefined && nodeBlockHeight !== null}
						<div>
							<dt>Node block height</dt>
							<dd>
								{String((nodeBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							solidityBlockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const solidityBlockHeight = prefetched.solidityBlockHeight}
					{#if solidityBlockHeight !== undefined && solidityBlockHeight !== null}
						<div>
							<dt>Solidity block height</dt>
							<dd>
								{String((solidityBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const solidityBlockHeight = resolvedEntity.solidityBlockHeight}
					{#if solidityBlockHeight !== undefined && solidityBlockHeight !== null}
						<div>
							<dt>Solidity block height</dt>
							<dd>
								{String((solidityBlockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							currentPeerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const currentPeerCount = prefetched.currentPeerCount}
					{#if currentPeerCount !== undefined && currentPeerCount !== null}
						<div>
							<dt>Current peers</dt>
							<dd>
								{String((currentPeerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const currentPeerCount = resolvedEntity.currentPeerCount}
					{#if currentPeerCount !== undefined && currentPeerCount !== null}
						<div>
							<dt>Current peers</dt>
							<dd>
								{String((currentPeerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							maintenanceIntervalMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maintenanceIntervalMs = prefetched.maintenanceIntervalMs}
					{#if maintenanceIntervalMs !== undefined && maintenanceIntervalMs !== null}
						<div>
							<dt>Maintenance interval</dt>
							<dd>
								{String((maintenanceIntervalMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maintenanceIntervalMs = resolvedEntity.maintenanceIntervalMs}
					{#if maintenanceIntervalMs !== undefined && maintenanceIntervalMs !== null}
						<div>
							<dt>Maintenance interval</dt>
							<dd>
								{String((maintenanceIntervalMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							transactionFeeSun: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionFeeSun = prefetched.transactionFeeSun}
					{#if transactionFeeSun !== undefined && transactionFeeSun !== null}
						<div>
							<dt>Transaction fee sun</dt>
							<dd>
								{String((transactionFeeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionFeeSun = resolvedEntity.transactionFeeSun}
					{#if transactionFeeSun !== undefined && transactionFeeSun !== null}
						<div>
							<dt>Transaction fee sun</dt>
							<dd>
								{String((transactionFeeSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							createAccountFeeSun: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createAccountFeeSun = prefetched.createAccountFeeSun}
					{#if createAccountFeeSun !== undefined && createAccountFeeSun !== null}
						<div>
							<dt>Create account fee sun</dt>
							<dd>
								<TruncatedValue value={String((createAccountFeeSun) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createAccountFeeSun = resolvedEntity.createAccountFeeSun}
					{#if createAccountFeeSun !== undefined && createAccountFeeSun !== null}
						<div>
							<dt>Create account fee sun</dt>
							<dd>
								<TruncatedValue value={String((createAccountFeeSun) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
