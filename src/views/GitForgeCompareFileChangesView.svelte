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
	}: EntityListViewProps<EntityType.GitForgeCompareFileChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeCompareFileChange}
	bind:open
	resource={
		selection({
			...{
				fields: {
					newPath: true,
					oldPath: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: gitForgeCompareFileChange })}
		{@const gitForgeCompareFileChangeSelector = gitForgeCompareFileChange[EntityMetaKey.Selector]}
		{@const compare = gitForgeCompareFileChangeSelector.$compare}
		<EntityView
			entityType={EntityType.GitForgeCompareFileChange}
			entitySelector={gitForgeCompareFileChangeSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/compare/[fromObjectId=zeroExHex]/[toObjectId=zeroExHex]/(gitForgeCompare)/file/[oldPath=stringSegment]/[newPath=stringSegment]',
					{
						forgeHost: compare.$forgeMirror.forgeHost,
						owner: compare.$forgeMirror.owner,
						repositoryName: compare.$forgeMirror.repositoryName,
						fromObjectId: compare.fromObjectId,
						toObjectId: compare.toObjectId,
						oldPath: encodeURIComponent(gitForgeCompareFileChangeSelector.oldPath),
						newPath: encodeURIComponent(gitForgeCompareFileChangeSelector.newPath),
					}
				)
			}
		>
			{#snippet Title()}
				{gitForgeCompareFileChangeSelector.newPath || 'Git forge compare file change'}
			{/snippet}

			{#snippet Value()}
				{gitForgeCompareFileChangeSelector.oldPath}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
