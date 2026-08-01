<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.GitBlob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitBlob}
	bind:open
	resource={
		selection({
			fields: {
				objectId: true,
				mime: true,
			},
		})
	}
>
	{#snippet Item({ item: gitBlob })}
		{@const gitBlobSelector = gitBlob[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitBlob}
			entitySelector={gitBlobSelector}
		>
			{#snippet Title()}
				{gitBlobSelector.objectId || 'Git blob'}
			{/snippet}

			{#snippet Value()}
				{gitBlob.mime ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
