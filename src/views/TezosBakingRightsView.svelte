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
	}: EntityListViewProps<EntityType.TezosBakingRight> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBakingRight}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakingRight })}
		{@const tezosBakingRightSelector = tezosBakingRight[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.TezosBakingRight}
			entitySelector={tezosBakingRightSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baking-right/[cycle=nonNegativeBigInt]/[level=nonNegativeBigInt]/[rightKind=stringSegment]/[bakerAddress=stringSegment]/[rightSource=stringSegment]',
					{
						network: (
							'caip2' in tezosBakingRightSelector.$network.$network ?
								caip2StringFromValue(tezosBakingRightSelector.$network.$network.caip2)
							:
								tezosBakingRightSelector.$network.$network.slug
						),
						cycle: String(tezosBakingRightSelector.cycle),
						level: String(tezosBakingRightSelector.level),
						rightKind: tezosBakingRightSelector.rightKind,
						bakerAddress: tezosBakingRightSelector.bakerAddress,
						rightSource: tezosBakingRightSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
