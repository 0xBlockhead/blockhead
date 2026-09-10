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
	}: EntityListViewProps<EntityType.GitForgeIssueNote> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeIssueNote}
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
	{#snippet Item({ item: gitForgeIssueNote })}
		{@const gitForgeIssueNoteSelector = gitForgeIssueNote[EntityMetaKey.Selector]}
		{@const issue = gitForgeIssueNoteSelector.$issue}
		<EntityView
			entityType={EntityType.GitForgeIssueNote}
			entitySelector={gitForgeIssueNoteSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]/(gitForgeIssue)/note/[noteId=nonNegativeInteger]',
					{
						forgeHost: issue.$forgeMirror.forgeHost,
						owner: issue.$forgeMirror.owner,
						repositoryName: issue.$forgeMirror.repositoryName,
						issueNumber: String(issue.issueNumber),
						noteId: String(gitForgeIssueNoteSelector.noteId),
					}
				)
			}
		>
			{#snippet Title()}
				{gitForgeIssueNote.body || String(gitForgeIssueNoteSelector.noteId) || 'Git forge issue note'}
			{/snippet}

			{#snippet Value()}
				{gitForgeIssueNote.noteType ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
