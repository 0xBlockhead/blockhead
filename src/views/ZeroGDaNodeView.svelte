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
	}: EntitySelectionViewProps<EntityType.ZeroGDaNode> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGChainScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGDaQuorumView from '$/views/ZeroGDaQuorumView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDaNode}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.nodeId || 'zero g da node')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.nodeId || 'zero g da node'}
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$quorum}
		>
			{#snippet children(zeroGDaQuorum)}
				{#if zeroGDaQuorum != null}
					<span data-text="muted">
						<ZeroGDaQuorumView
							selection={select(EntityType.ZeroGDaQuorum, zeroGDaQuorum[EntityMetaKey.Selector])}
							prefetched={zeroGDaQuorum}
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
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$quorum}
			>
				{#snippet children(zeroGDaQuorum)}
					{#if zeroGDaQuorum != null}
						<div>
							<dt>quorum</dt>
							<dd>
								<ZeroGDaQuorumView
									selection={select(EntityType.ZeroGDaQuorum, zeroGDaQuorum[EntityMetaKey.Selector])}
									prefetched={zeroGDaQuorum}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operator}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>operator</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
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
							endpoint: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endpoint = entity.endpoint}
					{#if endpoint != null}
						<div>
							<dt>endpoint</dt>
							<dd>
								{endpoint}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
