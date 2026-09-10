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
	}: EntityListViewProps<EntityType.GitForgePullRequest> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgePullRequest}
	bind:open
	resource={
		selection({
			fields: {
				title: true,
				state: true,
				pullRequestNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: gitForgePullRequest })}
		{@const gitForgePullRequestSelector = gitForgePullRequest[EntityMetaKey.Selector]}
		{@const forgeMirror = gitForgePullRequestSelector.$forgeMirror}
		<EntityView
			entityType={EntityType.GitForgePullRequest}
			entitySelector={gitForgePullRequestSelector}
			href={
				resolve(
					'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]',
					{
						forgeHost: forgeMirror.forgeHost,
						owner: forgeMirror.owner,
						repositoryName: forgeMirror.repositoryName,
						pullRequestNumber: String(gitForgePullRequestSelector.pullRequestNumber),
					}
				)
			}
		>
			{#snippet Title()}
				{(gitForgePullRequest.title ?? '') || String(gitForgePullRequestSelector.pullRequestNumber) || 'Git forge pull request'}
			{/snippet}

			{#snippet Value()}
				{gitForgePullRequest.state}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
