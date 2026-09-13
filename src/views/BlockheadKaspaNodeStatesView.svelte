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
		title = 'Blockhead Kaspa node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadKaspaNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadKaspaNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				connectionId: true,
				$network: true,
				networkId: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadKaspaNodeState })}
		{@const blockheadKaspaNodeStateSelector = blockheadKaspaNodeState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadKaspaNodeState}
			entitySelector={blockheadKaspaNodeStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/kaspa/connection/[connectionId=stringSegment]/node-state',
					{
						network: (
							blockheadKaspaNodeStateSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(blockheadKaspaNodeStateSelector.$network.$network.caip2)
							:
								blockheadKaspaNodeStateSelector.$network.$network.slug
						),
						connectionId: blockheadKaspaNodeStateSelector.connectionId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadKaspaNodeStateSelector.connectionId || 'blockhead kaspa node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadKaspaNodeState.$network.$network.name || (blockheadKaspaNodeState.$network.$network.caip2 == null ? '' : `${blockheadKaspaNodeState.$network.$network.caip2.namespace}:${blockheadKaspaNodeState.$network.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadKaspaNodeState.networkId ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
