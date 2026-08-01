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
		id = 'GitRepositories-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitRepository> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitRepository}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				repositoryId: true,
				canonicalRemoteUrl: true,
				objectFormat: true,
			},
		})
	}
>
	{#snippet Item({ item: gitRepository })}
		{@const gitRepositorySelector = gitRepository[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitRepository}
			entitySelector={gitRepositorySelector}
		>
			{#snippet Title()}
				{[gitRepositorySelector.repositoryId, (gitRepositorySelector.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || 'Git repository'}
			{/snippet}

			{#snippet Value()}
				{gitRepository.objectFormat}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
