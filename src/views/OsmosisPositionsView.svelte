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
	}: EntityListViewProps<EntityType.OsmosisPosition> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.OsmosisPosition}
	bind:open
	resource={
		selection({
			fields: {
				positionId: true,
				liquidity: true,
				tickLower: true,
				tickUpper: true,
				$pool: true,
			},
		})
	}
>
	{#snippet Item({ item: osmosisPosition })}
		{@const osmosisPositionSelector = osmosisPosition[EntityMetaKey.Selector]}
		{@const network = osmosisPositionSelector.$network}
		<EntityView
			entityType={EntityType.OsmosisPosition}
			entitySelector={osmosisPositionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-position/[positionId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						positionId: osmosisPositionSelector.positionId,
					}
				)
			}
		>
			{#snippet Title()}
				{osmosisPositionSelector.positionId || 'Osmosis position'}
			{/snippet}

			{#snippet Value()}
				{[(osmosisPosition.liquidity ?? ''), (osmosisPosition.tickLower ?? ''), (osmosisPosition.tickUpper ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[osmosisPosition.$pool.poolId, (osmosisPosition.$pool.typeUrl ?? '')].filter(Boolean).join(' ') || 'Osmosis pool'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
