<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AtprotoRepoCommit>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoRepoCommitView from '$/views/AtprotoRepoCommitView.svelte'
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
		{@const selection = select(EntityType.AtprotoRepoCommit, atprotoRepoCommit[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AtprotoRepoCommitView
			selection={selection}
			prefetched={atprotoRepoCommitFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
