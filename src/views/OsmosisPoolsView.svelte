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
	}: EntityListViewProps<EntityType.OsmosisPool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OsmosisPool}
	bind:open
	resource={
		selection({
			fields: {
				poolId: true,
				typeUrl: true,
				swapFee: true,
				exitFee: true,
				$network: true,
				liquidityKind: true,
			},
		})
	}
>
	{#snippet Item({ item: osmosisPool })}
		{@const osmosisPoolSelector = osmosisPool[EntityMetaKey.Selector]}
		{@const network = osmosisPoolSelector.$network}
		<EntityView
			entityType={EntityType.OsmosisPool}
			entitySelector={osmosisPoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						poolId: osmosisPoolSelector.poolId,
					}
				)
			}
		>
			{#snippet Title()}
				{[osmosisPoolSelector.poolId, (osmosisPool.typeUrl ?? '')].filter(Boolean).join(' ') || 'Osmosis pool'}
			{/snippet}

			{#snippet Value()}
				{[(osmosisPool.swapFee ?? ''), (osmosisPool.exitFee ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[osmosisPool.$network.name || (osmosisPool.$network.caip2 == null ? '' : `${osmosisPool.$network.caip2.namespace}:${osmosisPool.$network.caip2.reference}`) || 'Network', (osmosisPool.liquidityKind ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
