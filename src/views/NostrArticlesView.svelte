<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrArticle>
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
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.NostrArticle}
			entitySelector={nostrArticle[EntityMetaKey.Selector]}
			href={
				(
					nostrArticle[EntityMetaKey.Selector].kind === 30023
					&& nostrArticle[EntityMetaKey.Selector] != null && 'pubkey' in nostrArticle[EntityMetaKey.Selector]
					&& nostrArticle[EntityMetaKey.Selector].pubkey != null
					&& nostrArticle[EntityMetaKey.Selector] != null && 'identifier' in nostrArticle[EntityMetaKey.Selector]
					&& nostrArticle[EntityMetaKey.Selector].identifier != null ?
						resolve('/nostr/article/[pubkey=stringSegment]/[identifier=stringSegment]', {
					pubkey: String(nostrArticle[EntityMetaKey.Selector].pubkey ?? ''),
					identifier: String(nostrArticle[EntityMetaKey.Selector].identifier ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((nostrArticleFields.$latestEvent.title) ?? ''), String((nostrArticleFields.$latestEvent.identifier) ?? '')].filter(Boolean).join(' ') || [String((nostrArticleFields.$latestEvent.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr article event', String((nostrArticleFields.identifier) ?? '')].filter(Boolean).join(' ') || 'Nostr article'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((nostrArticleFields.kind) ?? '') ? 'kind ' + String((nostrArticleFields.kind) ?? '') : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
