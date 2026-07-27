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
	}: EntityListViewProps<EntityType.TezosBigMapKey> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMapKey}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapKey })}
		<EntityView
			entityType={EntityType.TezosBigMapKey}
			entitySelector={tezosBigMapKey[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos big map key
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
