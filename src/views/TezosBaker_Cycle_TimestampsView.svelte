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
	}: EntityListViewProps<EntityType.TezosBaker_Cycle_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBaker_Cycle_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakerCycleTimestamp })}
		{@const tezosBakerCycleTimestampSelector = tezosBakerCycleTimestamp[EntityMetaKey.Selector]}
		{@const baker = tezosBakerCycleTimestampSelector.$baker}
		<EntityView
			entityType={EntityType.TezosBaker_Cycle_Timestamp}
			entitySelector={tezosBakerCycleTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]/(tezosBaker)/cycle/[cycle=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							baker.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(baker.$network.$network.caip2)
							:
								baker.$network.$network.slug
						),
						address: baker.address,
						cycle: String(tezosBakerCycleTimestampSelector.cycle),
						source: tezosBakerCycleTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
