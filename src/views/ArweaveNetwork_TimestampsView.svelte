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
	}: EntityListViewProps<EntityType.ArweaveNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ArweaveNetwork_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: arweaveNetworkTimestamp })}
		<EntityView
			entityType={EntityType.ArweaveNetwork_Timestamp}
			entitySelector={arweaveNetworkTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
