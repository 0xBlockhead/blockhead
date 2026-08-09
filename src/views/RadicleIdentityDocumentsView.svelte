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
		{@const radicleIdentityDocumentSelector = radicleIdentityDocument[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.RadicleIdentityDocument}
			entitySelector={radicleIdentityDocumentSelector}
			href={
				resolve(
					'/radicle/identity/[rid=stringSegment]/revision/[revision=stringSegment]',
					{
						rid: radicleIdentityDocumentSelector.rid,
						revision: radicleIdentityDocumentSelector.revision,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
