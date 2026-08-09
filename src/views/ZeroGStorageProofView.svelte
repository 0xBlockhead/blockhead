<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGStorageProof>, 'prefetched'> = $props()

	const storageNode = $derived(selection.entitySelector.$storageNode)
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/storage-node/[nodeId=evmAddress]/(zeroGStorageNode)/proof/[proofId=stringSegment]',
				{
					network: (
						'caip2' in storageNode.$network ?
							caip2StringFromValue(storageNode.$network.caip2)
						:
							storageNode.$network.slug
					),
					nodeId: storageNode.nodeId,
					proofId: selection.entitySelector.proofId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ZeroGStorageNodeView
			selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
			href={null}
			layout={EntityLayout.Value}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>storage node</dt>
				<dd>
					<ZeroGStorageNodeView
						selection={select(EntityType.ZeroGStorageNode, selection.entitySelector.$storageNode)}
						layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
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
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
