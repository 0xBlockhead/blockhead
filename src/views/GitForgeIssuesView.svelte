<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Git forge issues',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GitForgeIssues-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.GitForgeIssue>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import GitForgeIssueView from '$/views/GitForgeIssueView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					title: true,
					state: true,
					issueNumber: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(gitForgeIssues)}
			{@const uniqueGitForgeIssues = [...new Map(gitForgeIssues.values.map((gitForgeIssue) => [gitForgeIssue[EntityMetaKey.SelectorKey], gitForgeIssue])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.GitForgeIssue}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={gitForgeIssues.totalCount}
				getKey={(gitForgeIssue) => gitForgeIssue[EntityMetaKey.SelectorKey]}
				items={uniqueGitForgeIssues}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Git forge issues yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: gitForgeIssue }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.GitForgeIssue> })}
					{@const gitForgeIssueFields = { ...gitForgeIssue[EntityMetaKey.Selector], ...gitForgeIssue }}
					<GitForgeIssueView
						selection={select(EntityType.GitForgeIssue, gitForgeIssue[EntityMetaKey.Selector])}
						prefetched={gitForgeIssueFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.GitForgeIssue}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
