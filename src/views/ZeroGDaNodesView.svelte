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
	}: EntityListViewProps<EntityType.ZeroGDaNode> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZeroGDaNode}
	bind:open
	resource={
		selection({
			fields: {
				nodeId: true,
				$network: true,
				$quorum: true,
			},
		})
	}
>
	{#snippet Item({ item: zeroGDaNode })}
		{@const zeroGDaNodeSelector = zeroGDaNode[EntityMetaKey.Selector]}
		{@const network = zeroGDaNodeSelector.$network}
		<EntityView
			entityType={EntityType.ZeroGDaNode}
			entitySelector={zeroGDaNodeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/da-node/[nodeId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						nodeId: zeroGDaNodeSelector.nodeId,
					}
				)
			}
		>
			{#snippet Title()}
				{zeroGDaNodeSelector.nodeId || 'zero g da node'}
			{/snippet}

			{#snippet Value()}
				{zeroGDaNode.$network.name || (zeroGDaNode.$network.caip2 == null ? '' : `${zeroGDaNode.$network.caip2.namespace}:${zeroGDaNode.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{zeroGDaNode.$quorum == null ? '' : zeroGDaNode.$quorum.quorumId || 'zero g da quorum'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
