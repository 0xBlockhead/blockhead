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
	}: EntityListViewProps<EntityType.SuiPackageUpgrade> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiPackageUpgrade}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiPackageUpgrade })}
		{@const suiPackageUpgradeSelector = suiPackageUpgrade[EntityMetaKey.Selector]}
		{@const packageValue = suiPackageUpgradeSelector.$package}
		<EntityView
			entityType={EntityType.SuiPackageUpgrade}
			entitySelector={suiPackageUpgradeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[originalPackageId=stringSegment]/(suiPackage)/upgrade/[upgradedPackageId=stringSegment]',
					{
						network: (
							'caip2' in packageValue.$network.$network ?
								caip2StringFromValue(packageValue.$network.$network.caip2)
							:
								packageValue.$network.$network.slug
						),
						originalPackageId: packageValue.originalPackageId,
						upgradedPackageId: suiPackageUpgradeSelector.upgradedPackageId,
					}
				)
			}
		>
			{#snippet Title()}
				Sui package upgrade
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
