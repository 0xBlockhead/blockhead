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
	}: EntityListViewProps<EntityType.GitForgeIssue> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgeIssue}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				state: true,
				issueNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgeIssue })}
		{@const gitForgeIssueSelector = gitForgeIssue[EntityMetaKey.Selector]}
		{@const forgeMirror = gitForgeIssueSelector.$forgeMirror}
		<EntityView
			entityType={EntityType.GitForgeIssue}
			entitySelector={gitForgeIssueSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]',
					{
						forgeHost: forgeMirror.forgeHost,
						owner: forgeMirror.owner,
						repositoryName: forgeMirror.repositoryName,
						issueNumber: String(gitForgeIssueSelector.issueNumber),
					}
				)
			}
		>
			{#snippet Title()}
				{(gitForgeIssue.title ?? '') || String(gitForgeIssueSelector.issueNumber) || 'Git forge issue'}
			{/snippet}

			{#snippet Value()}
				{gitForgeIssue.state}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
