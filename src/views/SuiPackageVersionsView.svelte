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
	}: EntityListViewProps<EntityType.SuiPackageVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiPackageVersion}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiPackageVersion })}
		{@const suiPackageVersionSelector = suiPackageVersion[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiPackageVersion}
			entitySelector={suiPackageVersionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[packageId=stringSegment]/version/[version=nonNegativeBigInt]/[digest=stringSegment]',
					{
						network: (
							'caip2' in suiPackageVersionSelector.$network.$network ?
								caip2StringFromValue(suiPackageVersionSelector.$network.$network.caip2)
							:
								suiPackageVersionSelector.$network.$network.slug
						),
						packageId: suiPackageVersionSelector.packageId,
						version: String(suiPackageVersionSelector.version),
						digest: suiPackageVersionSelector.digest,
					}
				)
			}
		>
			{#snippet Title()}
				Sui package version
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
