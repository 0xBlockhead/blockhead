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
	}: EntityListViewProps<EntityType.IcpNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpNetwork}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: icpNetwork })}
		<EntityView
			entityType={EntityType.IcpNetwork}
			entitySelector={icpNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{icpNetwork.$network.name || `${icpNetwork.$network.caip2.namespace}:${icpNetwork.$network.caip2.reference}` || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
