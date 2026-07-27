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
	}: EntityListViewProps<EntityType.HederaTopic_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTopic_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTopicTimestamp })}
		<EntityView
			entityType={EntityType.HederaTopic_Timestamp}
			entitySelector={hederaTopicTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera topic timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
