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
	}: EntitySelectionViewProps<EntityType.ZeroGStorageProof> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGStorageScan_Rest,
		],
	}))
	const zeroGStorageProof = $derived(viewSelection({
		fields: {
			proofKind: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageProof}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.proofId || 'zero g storage proof')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.proofId || 'zero g storage proof'}
	{/snippet}

	{#snippet Value()}
		<ZeroGStorageNodeView
			selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGStorageProof}>
			{#snippet children(entity)}
				{@const proofKind = entity.proofKind}
				{#if proofKind != null}
					<span data-text="muted">
						{proofKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>storage node</dt>
				<dd>
					<ZeroGStorageNodeView
						selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>proof ID</dt>
				<dd>
					{selection.entitySelector.proofId}
				</dd>
			</div>

			<ResourceBoundary
				resource={zeroGStorageProof}
			>
				{#snippet children(entity)}
					{@const proofKind = entity.proofKind}
					{#if proofKind != null}
						<div>
							<dt>proof kind</dt>
							<dd>
								{proofKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verifiedAtBlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAtBlock = entity.verifiedAtBlock}
					{#if verifiedAtBlock != null}
						<div>
							<dt>verified AT block</dt>
							<dd>
								<NumberValue
									value={verifiedAtBlock}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$dataBlob}
			>
				{#snippet children(zeroGDataBlob)}
					{#if zeroGDataBlob != null}
						<div>
							<dt>data blob</dt>
							<dd>
								<ZeroGDataBlobView
									selection={select(EntityType.ZeroGDataBlob, zeroGDataBlob[EntityMetaKey.Selector])}
									prefetched={zeroGDataBlob}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>
	{/snippet}
</EntityView>
