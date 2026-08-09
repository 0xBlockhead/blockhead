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
	}: EntityListViewProps<EntityType.TezosBaker_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBaker_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakerTimestamp })}
		{@const tezosBakerTimestampSelector = tezosBakerTimestamp[EntityMetaKey.Selector]}
		{@const baker = tezosBakerTimestampSelector.$baker}
		<EntityView
			entityType={EntityType.TezosBaker_Timestamp}
			entitySelector={tezosBakerTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baker/[address=stringSegment]/(tezosBaker)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in baker.$network.$network ?
								caip2StringFromValue(baker.$network.$network.caip2)
							:
								baker.$network.$network.slug
						),
						address: baker.address,
						level: String(tezosBakerTimestampSelector.level),
						source: tezosBakerTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
