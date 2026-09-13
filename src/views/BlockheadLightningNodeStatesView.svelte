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
	}: EntityListViewProps<EntityType.BlockheadLightningNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningNodeState}
	bind:open
	resource={
		selection({
			fields: {
				alias: true,
				$network: true,
				connectionId: true,
				$node: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningNodeState })}
		{@const blockheadLightningNodeStateSelector = blockheadLightningNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLightningNodeState}
			entitySelector={blockheadLightningNodeStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state',
					{
						network: (
							blockheadLightningNodeStateSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(blockheadLightningNodeStateSelector.$network.$network.caip2)
							:
								blockheadLightningNodeStateSelector.$network.$network.slug
						),
						connectionId: blockheadLightningNodeStateSelector.connectionId,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadLightningNodeState.alias ?? '') || blockheadLightningNodeStateSelector.connectionId || 'local LND node state'}
			{/snippet}

			{#snippet Value()}
				{(blockheadLightningNodeState.$network.name ?? '') || blockheadLightningNodeState.$network.$network.name || (blockheadLightningNodeState.$network.$network.caip2 == null ? '' : `${blockheadLightningNodeState.$network.$network.caip2.namespace}:${blockheadLightningNodeState.$network.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningNodeState.$node == null ? '' : blockheadLightningNodeState.$node.publicKey || 'Lightning public node'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
