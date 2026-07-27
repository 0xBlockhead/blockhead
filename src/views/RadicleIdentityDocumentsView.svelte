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
	}: EntityListViewProps<EntityType.RadicleIdentityDocument> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleIdentityDocument}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleIdentityDocument })}
		<EntityView
			entityType={EntityType.RadicleIdentityDocument}
			entitySelector={radicleIdentityDocument[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle identity document
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
