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
	}: EntityListViewProps<EntityType.TezosBigMapKey_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMapKey_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapKeyTimestamp })}
		{@const tezosBigMapKeyTimestampSelector = tezosBigMapKeyTimestamp[EntityMetaKey.Selector]}
		{@const bigMapKey = tezosBigMapKeyTimestampSelector.$bigMapKey}
		<EntityView
			entityType={EntityType.TezosBigMapKey_Timestamp}
			entitySelector={tezosBigMapKeyTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/key/[keyHash=stringSegment]/(tezosBigMapKey)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in bigMapKey.$bigMap.$contract.$network.$network ?
								caip2StringFromValue(bigMapKey.$bigMap.$contract.$network.$network.caip2)
							:
								bigMapKey.$bigMap.$contract.$network.$network.slug
						),
						address: bigMapKey.$bigMap.$contract.address,
						bigMapId: String(bigMapKey.$bigMap.bigMapId),
						keyHash: bigMapKey.keyHash,
						level: String(tezosBigMapKeyTimestampSelector.level),
						source: tezosBigMapKeyTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
