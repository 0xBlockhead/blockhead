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
	}: EntityListViewProps<EntityType.TezosBigMap_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMap_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapTimestamp })}
		{@const tezosBigMapTimestampSelector = tezosBigMapTimestamp[EntityMetaKey.Selector]}
		{@const bigMap = tezosBigMapTimestampSelector.$bigMap}
		<EntityView
			entityType={EntityType.TezosBigMap_Timestamp}
			entitySelector={tezosBigMapTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							bigMap.$contract.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(bigMap.$contract.$network.$network.caip2)
							:
								bigMap.$contract.$network.$network.slug
						),
						address: bigMap.$contract.address,
						bigMapId: String(bigMap.bigMapId),
						level: String(tezosBigMapTimestampSelector.level),
						source: tezosBigMapTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
