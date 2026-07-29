<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.NearNetwork_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearNetworkTimestamp = $derived(viewSelection({
		fields: {
			headHeight: true,
			headHash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearNetworkView from '$/views/NearNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork_Timestamp}
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
		<ResourceBoundary resource={nearNetworkTimestamp}>
			{#snippet children(entity)}
				{@const headHeight = entity.headHeight}
				{#if headHeight != null}
					<NumberValue
						value={headHeight}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearNetworkTimestamp}>
			{#snippet children(entity)}
				{@const headHash = entity.headHash}
				{#if headHash != null}
					<span data-text="muted">
						<TruncatedValue value={headHash} />
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
					<NearNetworkView
						selection={select(EntityType.NearNetwork, selection.entitySelector.$network)}
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
				resource={nearNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const headHeight = entity.headHeight}
					{#if headHeight != null}
						<div>
							<dt>Head height</dt>
							<dd>
								<NumberValue
									value={headHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const headHash = entity.headHash}
					{#if headHash != null}
						<div>
							<dt>Head hash</dt>
							<dd>
								<TruncatedValue value={headHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							epochId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochId = entity.epochId}
					{#if epochId != null}
						<div>
							<dt>Epoch ID</dt>
							<dd>
								{epochId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							epochHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochHeight = entity.epochHeight}
					{#if epochHeight != null}
						<div>
							<dt>Epoch height</dt>
							<dd>
								<NumberValue
									value={epochHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							epochStartHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochStartHeight = entity.epochStartHeight}
					{#if epochStartHeight != null}
						<div>
							<dt>Epoch start height</dt>
							<dd>
								<NumberValue
									value={epochStartHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							gasPriceYoctoNear: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasPriceYoctoNear = entity.gasPriceYoctoNear}
					{#if gasPriceYoctoNear != null}
						<div>
							<dt>Gas price yocto near</dt>
							<dd>
								<NumberValue
									value={gasPriceYoctoNear}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							chunkCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chunkCount = entity.chunkCount}
					{#if chunkCount != null}
						<div>
							<dt>Chunk count</dt>
							<dd>
								<NumberValue
									value={chunkCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							currentValidatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentValidatorCount = entity.currentValidatorCount}
					{#if currentValidatorCount != null}
						<div>
							<dt>Current validators</dt>
							<dd>
								<NumberValue
									value={currentValidatorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nextValidatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextValidatorCount = entity.nextValidatorCount}
					{#if nextValidatorCount != null}
						<div>
							<dt>Next validators</dt>
							<dd>
								<NumberValue
									value={nextValidatorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							currentProposalCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const currentProposalCount = entity.currentProposalCount}
					{#if currentProposalCount != null}
						<div>
							<dt>Current proposals</dt>
							<dd>
								<NumberValue
									value={currentProposalCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>Protocol version</dt>
							<dd>
								<NumberValue
									value={protocolVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							latestProtocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latestProtocolVersion = entity.latestProtocolVersion}
					{#if latestProtocolVersion != null}
						<div>
							<dt>Latest protocol version</dt>
							<dd>
								<NumberValue
									value={latestProtocolVersion}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							nodeVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nodeVersion = entity.nodeVersion}
					{#if nodeVersion != null}
						<div>
							<dt>Node version</dt>
							<dd>
								{nodeVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							syncing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const syncing = entity.syncing}
					{#if syncing != null}
						<div>
							<dt>Syncing</dt>
							<dd>
								{syncing ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
