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
	}: EntityListViewProps<EntityType.ComplianceModule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ComplianceModule}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: complianceModule })}
		{@const complianceModuleSelector = complianceModule[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ComplianceModule}
			entitySelector={complianceModuleSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/regulated-profile/(regulatedAssetProfile)/compliance-module/[moduleKey=stringSegment]',
					{
						network: (
							complianceModuleSelector.$profile.$assetInstance.$network.caip2 !== undefined ?
								caip2StringFromValue(complianceModuleSelector.$profile.$assetInstance.$network.caip2)
							:
								complianceModuleSelector.$profile.$assetInstance.$network.slug
						),
						kind: complianceModuleSelector.$profile.$assetInstance.kind,
						assetKey: complianceModuleSelector.$profile.$assetInstance.assetKey,
						moduleKey: complianceModuleSelector.moduleKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
