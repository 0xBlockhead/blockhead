<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			fields: {
				name: true,
				upgradeId: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: networkUpgrade })}
		{@const networkUpgradeSelector = networkUpgrade[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NetworkUpgrade}
			entitySelector={networkUpgradeSelector}
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
