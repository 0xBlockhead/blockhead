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
	}: EntityListViewProps<EntityType.GitForgeRelease> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeRelease}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				releaseTagName: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeRelease })}
		{@const gitForgeReleaseSelector = gitForgeRelease[EntityMetaKey.Selector]}
		{@const forgeMirror = gitForgeReleaseSelector.$forgeMirror}
		<EntityView
			entityType={EntityType.GitForgeRelease}
			entitySelector={gitForgeReleaseSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/release/[releaseTagName=stringSegment]',
					{
						forgeHost: forgeMirror.forgeHost,
						owner: forgeMirror.owner,
						repositoryName: forgeMirror.repositoryName,
						releaseTagName: gitForgeReleaseSelector.releaseTagName,
					}
				)
			}
		>
			{#snippet Title()}
				{(gitForgeRelease.name ?? '') || gitForgeReleaseSelector.releaseTagName || 'Git forge release'}
			{/snippet}

			{#snippet Value()}
				{gitForgeReleaseSelector.releaseTagName}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
