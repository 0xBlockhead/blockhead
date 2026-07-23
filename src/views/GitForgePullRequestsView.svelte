<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Git forge pull requests',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GitForgePullRequests-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.GitForgePullRequest>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitForgePullRequest}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				title: true,
				state: true,
				pullRequestNumber: true,
			},
		})
	}
	{countResource}
	getResourceItems={(gitForgePullRequests) => [...new Map(gitForgePullRequests.values.map((gitForgePullRequest) => [gitForgePullRequest[EntityMetaKey.SelectorKey], gitForgePullRequest])).values()]}
	getKey={(gitForgePullRequest) => gitForgePullRequest[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Git forge pull requests yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: gitForgePullRequest })}
		{@const gitForgePullRequestFields = { ...gitForgePullRequest[EntityMetaKey.Selector], ...gitForgePullRequest }}
		<EntityView
			entityType={EntityType.GitForgePullRequest}
			entitySelector={gitForgePullRequest[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((gitForgePullRequestFields.title) ?? '')].filter(Boolean).join(' ') || [String((gitForgePullRequestFields.pullRequestNumber) ?? '')].filter(Boolean).join(' ') || 'Git forge pull request'}
			{/snippet}

			{#snippet Value()}
				{[String((gitForgePullRequestFields.state) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
