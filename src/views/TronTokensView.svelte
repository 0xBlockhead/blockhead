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
	}: EntityListViewProps<EntityType.TronToken> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronToken}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronToken })}
		<EntityView
			entityType={EntityType.TronToken}
			entitySelector={tronToken[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tron token
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
