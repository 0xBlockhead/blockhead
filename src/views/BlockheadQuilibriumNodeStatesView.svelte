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
		title = 'Blockhead Quilibrium node states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumNodeState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumNodeState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				connectionId: true,
				$network: true,
				endpoint: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadQuilibriumNodeState })}
		{@const blockheadQuilibriumNodeStateSelector = blockheadQuilibriumNodeState[EntityMetaKey.Selector]}
		{@const network = blockheadQuilibriumNodeStateSelector.$network}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumNodeState}
			entitySelector={blockheadQuilibriumNodeStateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/node-state',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						connectionId: blockheadQuilibriumNodeStateSelector.connectionId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadQuilibriumNodeStateSelector.connectionId || 'blockhead quilibrium node state'}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumNodeState.$network.name || (blockheadQuilibriumNodeState.$network.caip2 == null ? '' : `${blockheadQuilibriumNodeState.$network.caip2.namespace}:${blockheadQuilibriumNodeState.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumNodeState.endpoint ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
