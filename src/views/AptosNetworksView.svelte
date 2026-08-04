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
	}: EntityListViewProps<EntityType.AptosNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosNetwork}
	bind:open
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosNetwork })}
		<EntityView
			entityType={EntityType.AptosNetwork}
			entitySelector={aptosNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{aptosNetwork.$network.name || (aptosNetwork.$network.caip2 == null ? '' : `${aptosNetwork.$network.caip2.namespace}:${aptosNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
