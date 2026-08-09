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
	}: EntityListViewProps<EntityType.SuiNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiNetwork}
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
	{#snippet Item({ item: suiNetwork })}
		<EntityView
			entityType={EntityType.SuiNetwork}
			entitySelector={suiNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{suiNetwork.$network.name || (suiNetwork.$network.caip2 == null ? '' : `${suiNetwork.$network.caip2.namespace}:${suiNetwork.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
