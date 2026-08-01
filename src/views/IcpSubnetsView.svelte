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
	}: EntityListViewProps<EntityType.IcpSubnet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnet}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpSubnet })}
		<EntityView
			entityType={EntityType.IcpSubnet}
			entitySelector={icpSubnet[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP subnet
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
