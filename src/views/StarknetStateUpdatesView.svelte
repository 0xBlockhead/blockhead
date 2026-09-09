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
	}: EntityListViewProps<EntityType.StarknetStateUpdate> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetStateUpdate}
	bind:open
	resource={
		selection({
			fields: {
				blockHash: true,
				$block: {
					fields: {
						blockNumber: true,
						blockHash: true,
						status: true,
					},
				},
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetStateUpdate })}
		{@const starknetStateUpdateSelector = starknetStateUpdate[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetStateUpdate}
			entitySelector={starknetStateUpdateSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(starknet)/state-update/[blockHash=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in starknetStateUpdateSelector.$network.$network ?
								caip2StringFromValue(starknetStateUpdateSelector.$network.$network.caip2)
							:
								starknetStateUpdateSelector.$network.$network.slug
						),
						blockHash: starknetStateUpdateSelector.blockHash,
						source: starknetStateUpdateSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetStateUpdateSelector.blockHash || 'Starknet state update'}
			{/snippet}

			{#snippet Value()}
				{String(starknetStateUpdate.$block.blockNumber) || 'starknet block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetStateUpdateSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
