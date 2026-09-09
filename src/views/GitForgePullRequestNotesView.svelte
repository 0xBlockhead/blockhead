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
	}: EntityListViewProps<EntityType.GitForgePullRequestNote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgePullRequestNote}
	bind:open
	resource={
		selection({
			fields: {
				body: true,
				noteType: true,
				noteId: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgePullRequestNote })}
		{@const gitForgePullRequestNoteSelector = gitForgePullRequestNote[EntityMetaKey.Selector]}
		{@const pullRequest = gitForgePullRequestNoteSelector.$pullRequest}
		<EntityView
			entityType={EntityType.GitForgePullRequestNote}
			entitySelector={gitForgePullRequestNoteSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]/(gitForgePullRequest)/note/[noteId=nonNegativeInteger]',
					{
						forgeHost: pullRequest.$forgeMirror.forgeHost,
						owner: pullRequest.$forgeMirror.owner,
						repositoryName: pullRequest.$forgeMirror.repositoryName,
						pullRequestNumber: String(pullRequest.pullRequestNumber),
						noteId: String(gitForgePullRequestNoteSelector.noteId),
					}
				)
			}
		>
			{#snippet Title()}
				{gitForgePullRequestNote.body || String(gitForgePullRequestNoteSelector.noteId) || 'Git forge pull request note'}
			{/snippet}

			{#snippet Value()}
				{gitForgePullRequestNote.noteType ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
