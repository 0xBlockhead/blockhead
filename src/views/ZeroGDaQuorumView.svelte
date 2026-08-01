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


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGDaNodesView from '$/views/ZeroGDaNodesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDaQuorum}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.quorumId || 'zero g da quorum')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
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
					/>
				</dd>
			</div>

			<div>
				<dt>quorum ID</dt>
				<dd>
					{selection.entitySelector.quorumId}
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
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources ?? [
							Source.ZeroGChainScan_Rest,
							Source.ZeroGStorageNode_JsonRpc,
						],
					})({
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
		{@const daNodesResource = selection.$$daNodes}
		<ResourceBoundary
			resource={daNodesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ZeroGDaNodesView
						selection={daNodesResource}
						countResource={daNodesResource.count}
						title='DA nodes'
						id='da-nodes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
