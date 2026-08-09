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
	}: EntityListViewProps<EntityType.NetworkUpgrade> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkUpgrade}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
					upgradeId: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: networkUpgrade })}
		{@const networkUpgradeSelector = networkUpgrade[EntityMetaKey.Selector]}
		{@const network = networkUpgradeSelector.$network}
		<EntityView
			entityType={EntityType.NetworkUpgrade}
			entitySelector={networkUpgradeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrade/id/[upgradeId=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						upgradeId: networkUpgradeSelector.upgradeId,
					}
				)
			}
		>
			{#snippet Title()}
				{[networkUpgrade.name, networkUpgradeSelector.upgradeId].filter(Boolean).join(' ') || 'network upgrade'}
			{/snippet}

			{#snippet Value()}
				{networkUpgrade.$network.name || (networkUpgrade.$network.caip2 == null ? '' : `${networkUpgrade.$network.caip2.namespace}:${networkUpgrade.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
