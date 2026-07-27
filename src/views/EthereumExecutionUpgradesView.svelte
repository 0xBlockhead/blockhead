<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.EthereumExecutionUpgrade> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EthereumExecutionUpgrade}
	bind:open
	resource={
		selection({
			fields: {
				upgradeId: true,
				name: true,
			},
		})
	}
>
	{#snippet Item({ item: ethereumExecutionUpgrade })}
		{@const ethereumExecutionUpgradeSelector = ethereumExecutionUpgrade[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EthereumExecutionUpgrade}
			entitySelector={ethereumExecutionUpgradeSelector}
			href={
				(
					'slug' in ethereumExecutionUpgradeSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/execution/[upgradeSlug=stringSegment]',
							{
								network: (
									'caip2' in ethereumExecutionUpgradeSelector.$network ?
										String(caip2StringFromValue(ethereumExecutionUpgradeSelector.$network.caip2))
									:
										String(ethereumExecutionUpgradeSelector.$network.slug)
								),
								upgradeSlug: String(ethereumExecutionUpgradeSelector.slug),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{ethereumExecutionUpgradeSelector.upgradeId || ethereumExecutionUpgrade.name || 'Ethereum execution upgrade'}
			{/snippet}

			{#snippet Value()}
				{ethereumExecutionUpgradeSelector.upgradeId}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
