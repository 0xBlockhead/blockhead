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
	}: EntityListViewProps<EntityType.IssuerPower> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IssuerPower}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: issuerPower })}
		{@const issuerPowerSelector = issuerPower[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.IssuerPower}
			entitySelector={issuerPowerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/power/[powerKind=stringSegment]/[actorKey=stringSegment]/[source=stringSegment]',
					{
						network: (
							'caip2' in issuerPowerSelector.$profile.$assetInstance.$network ?
								caip2StringFromValue(issuerPowerSelector.$profile.$assetInstance.$network.caip2)
							:
								issuerPowerSelector.$profile.$assetInstance.$network.slug
						),
						kind: issuerPowerSelector.$profile.$assetInstance.kind,
						assetKey: issuerPowerSelector.$profile.$assetInstance.assetKey,
						powerKind: issuerPowerSelector.powerKind,
						actorKey: issuerPowerSelector.actorKey,
						source: issuerPowerSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
