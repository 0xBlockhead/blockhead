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
	}: EntityListViewProps<EntityType.SuiPackage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiPackage}
	bind:open
	resource={
		selection({
			fields: {
				originalPackageId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: suiPackage })}
		{@const suiPackageSelector = suiPackage[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SuiPackage}
			entitySelector={suiPackageSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[originalPackageId=stringSegment]',
					{
						network: (
							suiPackageSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(suiPackageSelector.$network.$network.caip2)
							:
								suiPackageSelector.$network.$network.slug
						),
						originalPackageId: suiPackageSelector.originalPackageId,
					}
				)
			}
		>
			{#snippet Title()}
				{suiPackageSelector.originalPackageId || 'Sui package'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{suiPackage.$network.$network.name || (suiPackage.$network.$network.caip2 == null ? '' : `${suiPackage.$network.$network.caip2.namespace}:${suiPackage.$network.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
