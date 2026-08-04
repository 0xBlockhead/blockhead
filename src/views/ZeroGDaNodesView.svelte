<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.ZeroGDaNode}
			entitySelector={zeroGDaNodeSelector}
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
