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
		title = 'Repo commits',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoRepoCommits-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AtprotoRepoCommit>
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
	entityType={EntityType.AtprotoRepoCommit}
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
				rev: true,
				commitCid: true,
				repoDid: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(atprotoRepoCommits) => [...new Map(atprotoRepoCommits.values.map((atprotoRepoCommit) => [atprotoRepoCommit[EntityMetaKey.SelectorKey], atprotoRepoCommit])).values()]}
	getKey={(atprotoRepoCommit) => atprotoRepoCommit[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AT Protocol repo commits yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: atprotoRepoCommit })}
		{@const atprotoRepoCommitFields = { ...atprotoRepoCommit[EntityMetaKey.Selector], ...atprotoRepoCommit }}
		<EntityView
			entityType={EntityType.AtprotoRepoCommit}
			entitySelector={atprotoRepoCommit[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((atprotoRepoCommitFields.rev) ?? ''), String((atprotoRepoCommitFields.commitCid) ?? '')].filter(Boolean).join(' ') || 'AT Protocol repo commit'}
			{/snippet}

			{#snippet Value()}
				{[String((atprotoRepoCommitFields.repoDid) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((atprotoRepoCommitFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
