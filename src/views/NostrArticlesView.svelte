<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Nostr articles',
		typeAnnotationParagraphs = ['A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrArticles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NostrArticle>
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
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrArticle}
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
				identifier: true,
				pubkey: true,
				kind: true,
				sensitive: true,
				contentWarning: true,
			},
		})
	}
	getResourceItems={(nostrArticles) => [...new Map(nostrArticles.values.map((nostrArticle) => [nostrArticle[EntityMetaKey.SelectorKey], nostrArticle])).values()]}
	getKey={(nostrArticle) => nostrArticle[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr articles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrArticle })}
		{@const nostrArticleFields = { ...nostrArticle[EntityMetaKey.Selector], ...nostrArticle }}
		{@const selection = select(EntityType.NostrArticle, nostrArticle[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const nostrArticleHrefFields = { ...nostrArticle, ...nostrArticle[EntityMetaKey.Selector] }}
		<NostrArticleView
			selection={selection}
			prefetched={nostrArticleFields}
			href={
				(nostrArticle[EntityMetaKey.Selector].kind === 30023 && nostrArticleHrefFields.pubkey !== undefined && nostrArticleHrefFields.identifier !== undefined ? resolve('/nostr/article/[pubkey=stringSegment]/[identifier=stringSegment]', {
					pubkey: String(nostrArticleHrefFields.pubkey ?? ''),
					identifier: String(nostrArticleHrefFields.identifier ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
