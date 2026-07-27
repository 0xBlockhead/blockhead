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
	}: EntityListViewProps<EntityType.ClaimTopicRequirement> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ClaimTopicRequirement}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: claimTopicRequirement })}
		<EntityView
			entityType={EntityType.ClaimTopicRequirement}
			entitySelector={claimTopicRequirement[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				claim topic requirement
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
