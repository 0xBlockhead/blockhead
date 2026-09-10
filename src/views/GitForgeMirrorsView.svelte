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
	}: EntityListViewProps<EntityType.GitForgeMirror> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeMirror}
	bind:open
	resource={
		selection({
			fields: {
				owner: true,
				repositoryName: true,
				forgeHost: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeMirror })}
		{@const gitForgeMirrorSelector = gitForgeMirror[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitForgeMirror}
			entitySelector={gitForgeMirrorSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]',
					{
						forgeHost: gitForgeMirrorSelector.forgeHost,
						owner: gitForgeMirrorSelector.owner,
						repositoryName: gitForgeMirrorSelector.repositoryName,
					}
				)
			}
		>
			{#snippet Title()}
				{[gitForgeMirrorSelector.owner, gitForgeMirrorSelector.repositoryName].filter(Boolean).join(' ') || 'Git forge mirror'}
			{/snippet}

			{#snippet Value()}
				{gitForgeMirrorSelector.forgeHost}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
