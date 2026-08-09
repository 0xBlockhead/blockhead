<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ZeroGStorageProof> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGStorageProof}
	bind:open
	resource={
		selection({
			...{
				fields: {
					proofId: true,
					$storageNode: true,
					proofKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: zeroGStorageProof })}
		{@const zeroGStorageProofSelector = zeroGStorageProof[EntityMetaKey.Selector]}
		{@const storageNode = zeroGStorageProofSelector.$storageNode}
		<EntityView
			entityType={EntityType.ZeroGStorageProof}
			entitySelector={zeroGStorageProofSelector}
			href={
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
						proofId: zeroGStorageProofSelector.proofId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGStorageProofSelector.proofId || 'zero g storage proof'}
			{/snippet}

			{#snippet Value()}
				zero g storage node
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGStorageProof.proofKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
