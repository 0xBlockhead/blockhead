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
	}: EntityListViewProps<EntityType.AlgorandApplication_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AlgorandApplication_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: algorandApplicationTimestamp })}
		{@const algorandApplicationTimestampSelector = algorandApplicationTimestamp[EntityMetaKey.Selector]}
		{@const application = algorandApplicationTimestampSelector.$application}
		<EntityView
			entityType={EntityType.AlgorandApplication_Timestamp}
			entitySelector={algorandApplicationTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/application/[applicationId=nonNegativeBigInt]/(algorandApplication)/observation/[round=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in application.$network.$network ?
								caip2StringFromValue(application.$network.$network.caip2)
							:
								application.$network.$network.slug
						),
						applicationId: String(application.applicationId),
						round: String(algorandApplicationTimestampSelector.round),
						source: algorandApplicationTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
