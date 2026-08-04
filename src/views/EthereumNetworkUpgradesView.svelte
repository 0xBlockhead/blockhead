<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EthereumNetworkUpgrade> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EthereumNetworkUpgrade}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Constants_Internal,
			],
			fields: {
				upgradeId: true,
				name: true,
			},
			limit: 512,
		})
	}
>
	{#snippet Item({ item: ethereumNetworkUpgrade })}
		{@const ethereumNetworkUpgradeSelector = ethereumNetworkUpgrade[EntityMetaKey.Selector]}
		{@const network = ethereumNetworkUpgradeSelector.$network}
		<EntityView
			entityType={EntityType.EthereumNetworkUpgrade}
			entitySelector={ethereumNetworkUpgradeSelector}
			href={
				'slug' in ethereumNetworkUpgradeSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							upgradeSlug: ethereumNetworkUpgradeSelector.slug,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{ethereumNetworkUpgrade.upgradeId || ethereumNetworkUpgrade.name || 'Ethereum network upgrade'}
			{/snippet}

			{#snippet Value()}
				{ethereumNetworkUpgrade.upgradeId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
