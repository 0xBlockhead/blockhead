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
	}: EntityListViewProps<EntityType.TronToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronToken_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronTokenTimestamp })}
		<EntityView
			entityType={EntityType.TronToken_Timestamp}
			entitySelector={tronTokenTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron token timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
