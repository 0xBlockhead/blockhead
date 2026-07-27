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
	}: EntityListViewProps<EntityType.HederaTopicMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTopicMessage}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTopicMessage })}
		<EntityView
			entityType={EntityType.HederaTopicMessage}
			entitySelector={hederaTopicMessage[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera topic message
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
