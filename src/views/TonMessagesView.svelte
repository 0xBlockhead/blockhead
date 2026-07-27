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
	}: EntityListViewProps<EntityType.TonMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonMessage}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonMessage })}
		<EntityView
			entityType={EntityType.TonMessage}
			entitySelector={tonMessage[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON message
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
