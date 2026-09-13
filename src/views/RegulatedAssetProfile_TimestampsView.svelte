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
	}: EntityListViewProps<EntityType.RegulatedAssetProfile_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RegulatedAssetProfile_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: regulatedAssetProfileTimestamp })}
		{@const regulatedAssetProfileTimestampSelector = regulatedAssetProfileTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RegulatedAssetProfile_Timestamp}
			entitySelector={regulatedAssetProfileTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							regulatedAssetProfileTimestampSelector.$profile.$assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(regulatedAssetProfileTimestampSelector.$profile.$assetInstance.$network.caip2)
							:
								regulatedAssetProfileTimestampSelector.$profile.$assetInstance.$network.slug
						),
						kind: regulatedAssetProfileTimestampSelector.$profile.$assetInstance.kind,
						assetKey: regulatedAssetProfileTimestampSelector.$profile.$assetInstance.assetKey,
						timestampMs: String(regulatedAssetProfileTimestampSelector.timestampMs),
						source: regulatedAssetProfileTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
