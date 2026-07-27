<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.KaspaNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: kaspaNetwork })}
		{@const kaspaNetworkSelector = kaspaNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.KaspaNetwork}
			entitySelector={kaspaNetworkSelector}
		>
			{#snippet Title()}
				{(kaspaNetwork.$network.name || (kaspaNetworkSelector.$network.caip2 == null ? '' : `${kaspaNetworkSelector.$network.caip2.namespace}:${kaspaNetworkSelector.$network.caip2.reference}`) || 'Network')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
