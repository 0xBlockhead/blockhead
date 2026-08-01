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
		<EntityView
			entityType={EntityType.GitForgeIssue}
			entitySelector={gitForgeIssueSelector}
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
