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
	}: EntityListViewProps<EntityType.RadicleIdentityRevision> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleIdentityRevision}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleIdentityRevision })}
		<EntityView
			entityType={EntityType.RadicleIdentityRevision}
			entitySelector={radicleIdentityRevision[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle identity revision
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
