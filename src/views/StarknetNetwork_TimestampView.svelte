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
	}: EntitySelectionViewProps<EntityType.StarknetNetwork_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder_JsonRpc,
			Source.Starknet_JsonRpc,
			Source.Starkscan_Rest,
			Source.Voyager_Rest,
		],
	}))
	const starknetNetworkTimestamp = $derived(viewSelection({
		fields: {
			latestBlockNumber: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StarknetNetworkView from '$/views/StarknetNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'starknet network timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<StarknetNetworkView
			selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetNetworkTimestamp}>
			{#snippet children(entity)}
				{@const latestBlockNumber = entity.latestBlockNumber}
				{#if latestBlockNumber != null}
					<span data-text="muted">
						<NumberValue
							value={latestBlockNumber}
						/>
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
					<StarknetNetworkView
						selection={select(EntityType.StarknetNetwork, selection.entitySelector.$network)}
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
				resource={starknetNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const latestBlockNumber = entity.latestBlockNumber}
					{#if latestBlockNumber != null}
						<div>
							<dt>latest block number</dt>
							<dd>
								<NumberValue
									value={latestBlockNumber}
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
		</dl>

		<dl data-column-item="center">
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
							<dt>syncing</dt>
							<dd>
								{syncing ? 'Yes' : 'No'}
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
							<dt>protocol version</dt>
							<dd>
								{protocolVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pendingBlockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingBlockHash = entity.pendingBlockHash}
					{#if pendingBlockHash != null}
						<div>
							<dt>pending block hash</dt>
							<dd>
								<TruncatedValue value={pendingBlockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
