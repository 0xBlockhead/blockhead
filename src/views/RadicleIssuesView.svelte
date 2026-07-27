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
	}: EntityListViewProps<EntityType.RadicleIssue> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RadicleIssue}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: radicleIssue })}
		<EntityView
			entityType={EntityType.RadicleIssue}
			entitySelector={radicleIssue[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				radicle issue
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
