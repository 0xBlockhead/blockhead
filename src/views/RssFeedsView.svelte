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
		title = 'RSS feeds',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssFeeds-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RssFeed>
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
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RssFeed}
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
				feedUrl: true,
				lastBuildDate: true,
			},
		})
	}
	getResourceItems={(rssFeeds) => [...new Map(rssFeeds.values.map((rssFeed) => [rssFeed[EntityMetaKey.SelectorKey], rssFeed])).values()]}
	getKey={(rssFeed) => rssFeed[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No RSS feeds yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: rssFeed })}
		{@const rssFeedFields = { ...rssFeed[EntityMetaKey.Selector], ...rssFeed }}
		{@const selection = select(EntityType.RssFeed, rssFeed[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const rssFeedHrefFields = { ...rssFeed, ...rssFeed[EntityMetaKey.Selector] }}
		<RssFeedView
			selection={selection}
			prefetched={rssFeedFields}
			href={
				(rssFeedHrefFields.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]', {
					feedUrl: encodeURIComponent(String(rssFeedHrefFields.feedUrl ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
