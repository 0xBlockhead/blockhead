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
	}: EntityListViewProps<EntityType.UsageRight_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UsageRight_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: usageRightTimestamp })}
		<EntityView
			entityType={EntityType.UsageRight_Timestamp}
			entitySelector={usageRightTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				usage right timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
