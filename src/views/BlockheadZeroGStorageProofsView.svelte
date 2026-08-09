<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead 0G storage proofs',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZeroGStorageProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZeroGStorageProof}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					proofId: true,
					verified: true,
					proofKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadZeroGStorageProof })}
		{@const blockheadZeroGStorageProofSelector = blockheadZeroGStorageProof[EntityMetaKey.Selector]}
		{@const nodeState = blockheadZeroGStorageProofSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadZeroGStorageProof}
			entitySelector={blockheadZeroGStorageProofSelector}
			href={
				resolve(
					'/zerog/[slug=stringSegment]/(zeroGNetwork)/~/zerog/connection/[connectionId=stringSegment]/node-state/[nodeId=evmAddress]/(blockheadZeroGStorageNodeState)/proof/[proofId=stringSegment]',
					{
						slug: nodeState.$network.slug,
						connectionId: nodeState.connectionId,
						nodeId: nodeState.nodeId,
						proofId: blockheadZeroGStorageProofSelector.proofId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadZeroGStorageProofSelector.proofId || 'blockhead zero g storage proof'}
			{/snippet}

			{#snippet Value()}
				{blockheadZeroGStorageProof.verified}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZeroGStorageProof.proofKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
