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
	}: EntityListViewProps<EntityType.IcpNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpNetworkTimestamp })}
		<EntityView
			entityType={EntityType.IcpNetwork_Timestamp}
			entitySelector={icpNetworkTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP network timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
