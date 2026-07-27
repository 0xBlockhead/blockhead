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
	}: EntityListViewProps<EntityType.IcpSubnet_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnet_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpSubnetTimestamp })}
		<EntityView
			entityType={EntityType.IcpSubnet_Timestamp}
			entitySelector={icpSubnetTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP subnet timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
