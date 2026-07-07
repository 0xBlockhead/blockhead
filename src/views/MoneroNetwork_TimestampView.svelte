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
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MoneroNetwork_Timestamp>>
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
	const moneroNetworkTimestamp = $derived(selection({
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
		fields: {
			height: true,
			status: true,
			synchronized: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'monero network timestamp')
	const viewDomId = $derived('monero-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={moneroNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroNetworkTimestamp}>
			{#snippet Pending()}
				{@const height0 = prefetched.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroNetworkTimestamp}>
			{#snippet Pending()}
				{@const status0 = prefetched.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
				{@const synchronized1 = prefetched.synchronized}
				{#if synchronized1 !== undefined && synchronized1 !== null}
					<span data-text="muted">
						{synchronized1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const status0 = resolvedEntity.status}
				{#if status0 !== undefined && status0 !== null}
					<span data-text="muted">
						{String((status0) ?? '')}
					</span>
				{/if}
				{@const synchronized1 = resolvedEntity.synchronized}
				{#if synchronized1 !== undefined && synchronized1 !== null}
					<span data-text="muted">
						{synchronized1 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
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
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							height: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const height = prefetched.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							targetHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetHeight = prefetched.targetHeight}
					{#if targetHeight !== undefined && targetHeight !== null}
						<div>
							<dt>Target height</dt>
							<dd>
								<NumberValue value={Number(targetHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetHeight = resolvedEntity.targetHeight}
					{#if targetHeight !== undefined && targetHeight !== null}
						<div>
							<dt>Target height</dt>
							<dd>
								<NumberValue value={Number(targetHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							topBlockHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const topBlockHash = prefetched.topBlockHash}
					{#if topBlockHash !== undefined && topBlockHash !== null}
						<div>
							<dt>Top block hash</dt>
							<dd>
								<TruncatedValue value={String((topBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const topBlockHash = resolvedEntity.topBlockHash}
					{#if topBlockHash !== undefined && topBlockHash !== null}
						<div>
							<dt>Top block hash</dt>
							<dd>
								<TruncatedValue value={String((topBlockHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							difficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const difficulty = prefetched.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>Difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const difficulty = resolvedEntity.difficulty}
					{#if difficulty !== undefined && difficulty !== null}
						<div>
							<dt>Difficulty</dt>
							<dd>
								<NumberValue value={Number(difficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							wideDifficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const wideDifficulty = prefetched.wideDifficulty}
					{#if wideDifficulty !== undefined && wideDifficulty !== null}
						<div>
							<dt>Wide difficulty</dt>
							<dd>
								<NumberValue value={Number(wideDifficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const wideDifficulty = resolvedEntity.wideDifficulty}
					{#if wideDifficulty !== undefined && wideDifficulty !== null}
						<div>
							<dt>Wide difficulty</dt>
							<dd>
								<NumberValue value={Number(wideDifficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							cumulativeDifficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cumulativeDifficulty = prefetched.cumulativeDifficulty}
					{#if cumulativeDifficulty !== undefined && cumulativeDifficulty !== null}
						<div>
							<dt>Cumulative difficulty</dt>
							<dd>
								<NumberValue value={Number(cumulativeDifficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cumulativeDifficulty = resolvedEntity.cumulativeDifficulty}
					{#if cumulativeDifficulty !== undefined && cumulativeDifficulty !== null}
						<div>
							<dt>Cumulative difficulty</dt>
							<dd>
								<NumberValue value={Number(cumulativeDifficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							wideCumulativeDifficulty: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const wideCumulativeDifficulty = prefetched.wideCumulativeDifficulty}
					{#if wideCumulativeDifficulty !== undefined && wideCumulativeDifficulty !== null}
						<div>
							<dt>Wide cumulative difficulty</dt>
							<dd>
								<NumberValue value={Number(wideCumulativeDifficulty)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const wideCumulativeDifficulty = resolvedEntity.wideCumulativeDifficulty}
					{#if wideCumulativeDifficulty !== undefined && wideCumulativeDifficulty !== null}
						<div>
							<dt>Wide cumulative difficulty</dt>
							<dd>
								<NumberValue value={Number(wideCumulativeDifficulty)} />
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
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							blockSizeLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockSizeLimit = prefetched.blockSizeLimit}
					{#if blockSizeLimit !== undefined && blockSizeLimit !== null}
						<div>
							<dt>Block size limit</dt>
							<dd>
								<NumberValue value={Number(blockSizeLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockSizeLimit = resolvedEntity.blockSizeLimit}
					{#if blockSizeLimit !== undefined && blockSizeLimit !== null}
						<div>
							<dt>Block size limit</dt>
							<dd>
								<NumberValue value={Number(blockSizeLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							blockSizeMedian: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockSizeMedian = prefetched.blockSizeMedian}
					{#if blockSizeMedian !== undefined && blockSizeMedian !== null}
						<div>
							<dt>Block size median</dt>
							<dd>
								<NumberValue value={Number(blockSizeMedian)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockSizeMedian = resolvedEntity.blockSizeMedian}
					{#if blockSizeMedian !== undefined && blockSizeMedian !== null}
						<div>
							<dt>Block size median</dt>
							<dd>
								<NumberValue value={Number(blockSizeMedian)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							blockWeightLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockWeightLimit = prefetched.blockWeightLimit}
					{#if blockWeightLimit !== undefined && blockWeightLimit !== null}
						<div>
							<dt>Block weight limit</dt>
							<dd>
								<NumberValue value={Number(blockWeightLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockWeightLimit = resolvedEntity.blockWeightLimit}
					{#if blockWeightLimit !== undefined && blockWeightLimit !== null}
						<div>
							<dt>Block weight limit</dt>
							<dd>
								<NumberValue value={Number(blockWeightLimit)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							blockWeightMedian: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockWeightMedian = prefetched.blockWeightMedian}
					{#if blockWeightMedian !== undefined && blockWeightMedian !== null}
						<div>
							<dt>Block weight median</dt>
							<dd>
								<NumberValue value={Number(blockWeightMedian)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockWeightMedian = resolvedEntity.blockWeightMedian}
					{#if blockWeightMedian !== undefined && blockWeightMedian !== null}
						<div>
							<dt>Block weight median</dt>
							<dd>
								<NumberValue value={Number(blockWeightMedian)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							databaseSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const databaseSize = prefetched.databaseSize}
					{#if databaseSize !== undefined && databaseSize !== null}
						<div>
							<dt>Database size</dt>
							<dd>
								<NumberValue value={Number(databaseSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const databaseSize = resolvedEntity.databaseSize}
					{#if databaseSize !== undefined && databaseSize !== null}
						<div>
							<dt>Database size</dt>
							<dd>
								<NumberValue value={Number(databaseSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							freeSpace: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freeSpace = prefetched.freeSpace}
					{#if freeSpace !== undefined && freeSpace !== null}
						<div>
							<dt>Free space</dt>
							<dd>
								<NumberValue value={Number(freeSpace)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeSpace = resolvedEntity.freeSpace}
					{#if freeSpace !== undefined && freeSpace !== null}
						<div>
							<dt>Free space</dt>
							<dd>
								<NumberValue value={Number(freeSpace)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							greyPeerlistSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const greyPeerlistSize = prefetched.greyPeerlistSize}
					{#if greyPeerlistSize !== undefined && greyPeerlistSize !== null}
						<div>
							<dt>Grey peerlist size</dt>
							<dd>
								<NumberValue value={Number(greyPeerlistSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const greyPeerlistSize = resolvedEntity.greyPeerlistSize}
					{#if greyPeerlistSize !== undefined && greyPeerlistSize !== null}
						<div>
							<dt>Grey peerlist size</dt>
							<dd>
								<NumberValue value={Number(greyPeerlistSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							whitePeerlistSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const whitePeerlistSize = prefetched.whitePeerlistSize}
					{#if whitePeerlistSize !== undefined && whitePeerlistSize !== null}
						<div>
							<dt>White peerlist size</dt>
							<dd>
								<NumberValue value={Number(whitePeerlistSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const whitePeerlistSize = resolvedEntity.whitePeerlistSize}
					{#if whitePeerlistSize !== undefined && whitePeerlistSize !== null}
						<div>
							<dt>White peerlist size</dt>
							<dd>
								<NumberValue value={Number(whitePeerlistSize)} />
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
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							incomingConnections: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const incomingConnections = prefetched.incomingConnections}
					{#if incomingConnections !== undefined && incomingConnections !== null}
						<div>
							<dt>Incoming connections</dt>
							<dd>
								<NumberValue value={Number(incomingConnections)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const incomingConnections = resolvedEntity.incomingConnections}
					{#if incomingConnections !== undefined && incomingConnections !== null}
						<div>
							<dt>Incoming connections</dt>
							<dd>
								<NumberValue value={Number(incomingConnections)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							outgoingConnections: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outgoingConnections = prefetched.outgoingConnections}
					{#if outgoingConnections !== undefined && outgoingConnections !== null}
						<div>
							<dt>Outgoing connections</dt>
							<dd>
								<NumberValue value={Number(outgoingConnections)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outgoingConnections = resolvedEntity.outgoingConnections}
					{#if outgoingConnections !== undefined && outgoingConnections !== null}
						<div>
							<dt>Outgoing connections</dt>
							<dd>
								<NumberValue value={Number(outgoingConnections)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							txCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txCount = prefetched.txCount}
					{#if txCount !== undefined && txCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								<NumberValue value={Number(txCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txCount = resolvedEntity.txCount}
					{#if txCount !== undefined && txCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								<NumberValue value={Number(txCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							txPoolSize: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txPoolSize = prefetched.txPoolSize}
					{#if txPoolSize !== undefined && txPoolSize !== null}
						<div>
							<dt>Transaction pool size</dt>
							<dd>
								<NumberValue value={Number(txPoolSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txPoolSize = resolvedEntity.txPoolSize}
					{#if txPoolSize !== undefined && txPoolSize !== null}
						<div>
							<dt>Transaction pool size</dt>
							<dd>
								<NumberValue value={Number(txPoolSize)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							altBlocksCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const altBlocksCount = prefetched.altBlocksCount}
					{#if altBlocksCount !== undefined && altBlocksCount !== null}
						<div>
							<dt>Alt blocks</dt>
							<dd>
								<NumberValue value={Number(altBlocksCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const altBlocksCount = resolvedEntity.altBlocksCount}
					{#if altBlocksCount !== undefined && altBlocksCount !== null}
						<div>
							<dt>Alt blocks</dt>
							<dd>
								<NumberValue value={Number(altBlocksCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							targetSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const targetSeconds = prefetched.targetSeconds}
					{#if targetSeconds !== undefined && targetSeconds !== null}
						<div>
							<dt>Target seconds</dt>
							<dd>
								<NumberValue value={Number(targetSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const targetSeconds = resolvedEntity.targetSeconds}
					{#if targetSeconds !== undefined && targetSeconds !== null}
						<div>
							<dt>Target seconds</dt>
							<dd>
								<NumberValue value={Number(targetSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							rpcConnections: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rpcConnections = prefetched.rpcConnections}
					{#if rpcConnections !== undefined && rpcConnections !== null}
						<div>
							<dt>RPC connections</dt>
							<dd>
								<NumberValue value={Number(rpcConnections)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rpcConnections = resolvedEntity.rpcConnections}
					{#if rpcConnections !== undefined && rpcConnections !== null}
						<div>
							<dt>RPC connections</dt>
							<dd>
								<NumberValue value={Number(rpcConnections)} />
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
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							mainnet: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mainnet = prefetched.mainnet}
					{#if mainnet !== undefined && mainnet !== null}
						<div>
							<dt>Mainnet</dt>
							<dd>
								{mainnet ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mainnet = resolvedEntity.mainnet}
					{#if mainnet !== undefined && mainnet !== null}
						<div>
							<dt>Mainnet</dt>
							<dd>
								{mainnet ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							nettype: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nettype = prefetched.nettype}
					{#if nettype !== undefined && nettype !== null}
						<div>
							<dt>Network type</dt>
							<dd>
								{String((nettype) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nettype = resolvedEntity.nettype}
					{#if nettype !== undefined && nettype !== null}
						<div>
							<dt>Network type</dt>
							<dd>
								{String((nettype) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							offline: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const offline = prefetched.offline}
					{#if offline !== undefined && offline !== null}
						<div>
							<dt>Offline</dt>
							<dd>
								{offline ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const offline = resolvedEntity.offline}
					{#if offline !== undefined && offline !== null}
						<div>
							<dt>Offline</dt>
							<dd>
								{offline ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							synchronized: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const synchronized = prefetched.synchronized}
					{#if synchronized !== undefined && synchronized !== null}
						<div>
							<dt>Synchronized</dt>
							<dd>
								{synchronized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const synchronized = resolvedEntity.synchronized}
					{#if synchronized !== undefined && synchronized !== null}
						<div>
							<dt>Synchronized</dt>
							<dd>
								{synchronized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							wasBootstrapEverUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const wasBootstrapEverUsed = prefetched.wasBootstrapEverUsed}
					{#if wasBootstrapEverUsed !== undefined && wasBootstrapEverUsed !== null}
						<div>
							<dt>Bootstrap ever used</dt>
							<dd>
								{wasBootstrapEverUsed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const wasBootstrapEverUsed = resolvedEntity.wasBootstrapEverUsed}
					{#if wasBootstrapEverUsed !== undefined && wasBootstrapEverUsed !== null}
						<div>
							<dt>Bootstrap ever used</dt>
							<dd>
								{wasBootstrapEverUsed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
