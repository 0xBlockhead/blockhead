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
		id = 'GitForgeProtectedBranches-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitForgeProtectedBranch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeProtectedBranch}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeProtectedBranch })}
		{@const gitForgeProtectedBranchSelector = gitForgeProtectedBranch[EntityMetaKey.Selector]}
		{@const forgeMirror = gitForgeProtectedBranchSelector.$forgeMirror}
		<EntityView
			entityType={EntityType.GitForgeProtectedBranch}
			entitySelector={gitForgeProtectedBranchSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/protected-branch/[name=stringSegment]',
					{
						forgeHost: forgeMirror.forgeHost,
						owner: forgeMirror.owner,
						repositoryName: forgeMirror.repositoryName,
						name: gitForgeProtectedBranchSelector.name,
					}
				)
			}
		>
			{#snippet Title()}
				{gitForgeProtectedBranchSelector.name || 'Git forge protected branch'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
