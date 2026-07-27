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
	}: EntityListViewProps<EntityType.SuiObjectVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiObjectVersion}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiObjectVersion })}
		<EntityView
			entityType={EntityType.SuiObjectVersion}
			entitySelector={suiObjectVersion[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Sui object version
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
