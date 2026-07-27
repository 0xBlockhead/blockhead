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
	}: EntityListViewProps<EntityType.HederaTopic> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTopic}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTopic })}
		<EntityView
			entityType={EntityType.HederaTopic}
			entitySelector={hederaTopic[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera topic
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
