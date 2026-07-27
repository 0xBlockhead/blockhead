<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.ZeroGDaQuorum> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGChainScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))
	const titleFallback = $derived((pendingEntity.quorumId ?? '') || 'zero g da quorum')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGDaNodesView from '$/views/ZeroGDaNodesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDaQuorum}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.quorumId ?? '') || 'zero g da quorum'}
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$consensusNetwork}
		>
			{#snippet children(zeroGConsensusNetwork)}
				{#if zeroGConsensusNetwork != null}
					<span data-text="muted">
						<ZeroGConsensusNetworkView
							selection={select(EntityType.ZeroGConsensusNetwork, zeroGConsensusNetwork[EntityMetaKey.Selector])}
							prefetched={zeroGConsensusNetwork}
							layout={EntityLayout.Title}
							open={false}
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
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>quorum ID</dt>
				<dd>
					{pendingEntity.quorumId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$consensusNetwork}
			>
				{#snippet children(zeroGConsensusNetwork)}
					{#if zeroGConsensusNetwork != null}
						<div>
							<dt>consensus network</dt>
							<dd>
								<ZeroGConsensusNetworkView
									selection={select(EntityType.ZeroGConsensusNetwork, zeroGConsensusNetwork[EntityMetaKey.Selector])}
									prefetched={zeroGConsensusNetwork}
									layout={EntityLayout.Value}
									open={false}
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
							selectionMethod: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const selectionMethod = entity.selectionMethod}
					{#if selectionMethod != null}
						<div>
							<dt>selection method</dt>
							<dd>
								{selectionMethod}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const zeroGDaQuorumZeroGDaNodesViewDaNodesResource = selection.$$daNodes}
		<ResourceBoundary
			resource={zeroGDaQuorumZeroGDaNodesViewDaNodesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ZeroGDaNodesView
						selection={zeroGDaQuorumZeroGDaNodesViewDaNodesResource}
						countResource={zeroGDaQuorumZeroGDaNodesViewDaNodesResource.count}
						title='DA nodes'
						id='da-nodes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
