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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RssFeed>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.RssFeed}
			entitySelector={rssFeed[EntityMetaKey.Selector]}
			href={
				(
					rssFeed[EntityMetaKey.Selector] != null && 'feedUrl' in rssFeed[EntityMetaKey.Selector]
					&& rssFeed[EntityMetaKey.Selector].feedUrl != null ?
						resolve('/rss/feed/[feedUrl=absoluteUrl]', {
					feedUrl: encodeURIComponent(String(rssFeed[EntityMetaKey.Selector].feedUrl ?? '')),
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
				{[String((rssFeedFields.title) ?? ''), String((rssFeedFields.feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed'}
			{/snippet}

			{#snippet Value()}
				{[String((rssFeedFields.feedUrl) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((rssFeedFields.lastBuildDate) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
