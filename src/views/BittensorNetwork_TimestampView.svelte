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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BittensorNetwork_Timestamp>, 'prefetched'> = $props()

	const bittensorNetworkTimestamp = $derived(selection({
		fields: {
			finalizedBlockNumber: true,
			runtimeSpecName: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bittensorNetworkTimestamp}>
			{#snippet children(entity)}
				{@const finalizedBlockNumber = entity.finalizedBlockNumber}
				{#if finalizedBlockNumber != null}
					<NumberValue
						value={finalizedBlockNumber}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bittensorNetworkTimestamp}>
			{#snippet children(entity)}
				{@const runtimeSpecName = entity.runtimeSpecName}
				{#if runtimeSpecName != null}
					<span data-text="muted">
						{runtimeSpecName}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

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
				resource={bittensorNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const finalizedBlockNumber = entity.finalizedBlockNumber}
					{#if finalizedBlockNumber != null}
						<div>
							<dt>Finalized block number</dt>
							<dd>
								<NumberValue
									value={finalizedBlockNumber}
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
							finalizedBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalizedBlockHash = entity.finalizedBlockHash}
					{#if finalizedBlockHash != null}
						<div>
							<dt>Finalized block hash</dt>
							<dd>
								<TruncatedValue value={finalizedBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={bittensorNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const runtimeSpecName = entity.runtimeSpecName}
					{#if runtimeSpecName != null}
						<div>
							<dt>Runtime spec</dt>
							<dd>
								{runtimeSpecName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeSpecVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runtimeSpecVersion = entity.runtimeSpecVersion}
					{#if runtimeSpecVersion != null}
						<div>
							<dt>Runtime spec version</dt>
							<dd>
								<NumberValue
									value={runtimeSpecVersion}
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
							runtimeImplVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runtimeImplVersion = entity.runtimeImplVersion}
					{#if runtimeImplVersion != null}
						<div>
							<dt>Runtime implementation version</dt>
							<dd>
								<NumberValue
									value={runtimeImplVersion}
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
							peerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>Peers</dt>
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
							isSyncing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isSyncing = entity.isSyncing}
					{#if isSyncing != null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{isSyncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shouldHavePeers: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const shouldHavePeers = entity.shouldHavePeers}
					{#if shouldHavePeers != null}
						<div>
							<dt>Should have peers</dt>
							<dd>
								{shouldHavePeers ? 'Yes' : 'No'}
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
							subnetCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetCount = entity.subnetCount}
					{#if subnetCount != null}
						<div>
							<dt>Subnets</dt>
							<dd>
								<NumberValue
									value={subnetCount}
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
							subnetsInfoByteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetsInfoByteLength = entity.subnetsInfoByteLength}
					{#if subnetsInfoByteLength != null}
						<div>
							<dt>Subnet info bytes</dt>
							<dd>
								<NumberValue
									value={subnetsInfoByteLength}
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
							dynamicInfoByteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dynamicInfoByteLength = entity.dynamicInfoByteLength}
					{#if dynamicInfoByteLength != null}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd>
								<NumberValue
									value={dynamicInfoByteLength}
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
							metagraphsByteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metagraphsByteLength = entity.metagraphsByteLength}
					{#if metagraphsByteLength != null}
						<div>
							<dt>Metagraph bytes</dt>
							<dd>
								<NumberValue
									value={metagraphsByteLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
