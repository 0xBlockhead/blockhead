<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A generic network-upgrade compatibility row keyed by network and upgrade id. Rich Ethereum-specific upgrade modeling remains on EthereumNetworkUpgrade and related execution/consensus rows.'],
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
	{typeAnnotationParagraphs}
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
				{networkUpgrade.$network.name || (networkUpgradeSelector.$network.caip2 == null ? '' : `${networkUpgradeSelector.$network.caip2.namespace}:${networkUpgradeSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
