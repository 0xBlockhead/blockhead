<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		{@const radicleIdentityRevisionSelector = radicleIdentityRevision[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadicleIdentityRevision}
			entitySelector={radicleIdentityRevisionSelector}
			href={
				resolve(
					'/radicle/identity/[rid=stringSegment]/revision/[revision=stringSegment]/(radicleIdentityDocument)/document',
					{
						rid: radicleIdentityRevisionSelector.rid,
						revision: radicleIdentityRevisionSelector.revision,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
