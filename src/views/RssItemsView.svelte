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
		title = 'RSS items',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RssItems-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RssItem>
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
	entityType={EntityType.RssItem}
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
				itemIdentity: true,
				publishedAt: true,
				itemIdentityKind: true,
				$feed: true,
			},
		})
	}
	{countResource}
	getResourceItems={(rssItems) => [...new Map(rssItems.values.map((rssItem) => [rssItem[EntityMetaKey.SelectorKey], rssItem])).values()]}
	getKey={(rssItem) => rssItem[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No RSS items yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: rssItem })}
		{@const rssItemFields = { ...rssItem[EntityMetaKey.Selector], ...rssItem }}
		<EntityView
			entityType={EntityType.RssItem}
			entitySelector={rssItem[EntityMetaKey.Selector]}
			href={
				(
					rssItem[EntityMetaKey.Selector] != null && 'itemIdentityKind' in rssItem[EntityMetaKey.Selector]
					&& rssItem[EntityMetaKey.Selector].itemIdentityKind != null
					&& rssItem[EntityMetaKey.Selector] != null && 'itemIdentity' in rssItem[EntityMetaKey.Selector]
					&& rssItem[EntityMetaKey.Selector].itemIdentity != null
					&& rssItem[EntityMetaKey.Selector] != null && '$feed' in rssItem[EntityMetaKey.Selector]
					&& rssItem[EntityMetaKey.Selector].$feed != null && 'feedUrl' in rssItem[EntityMetaKey.Selector].$feed
					&& rssItem[EntityMetaKey.Selector].$feed.feedUrl != null ?
						resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
					itemIdentityKind: String(rssItem[EntityMetaKey.Selector].itemIdentityKind ?? ''),
					itemIdentity: encodeURIComponent(String(rssItem[EntityMetaKey.Selector].itemIdentity ?? '')),
					feedUrl: encodeURIComponent(String(rssItem[EntityMetaKey.Selector].$feed.feedUrl ?? '')),
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
				{[String((rssItemFields.title) ?? ''), String((rssItemFields.itemIdentity) ?? '')].filter(Boolean).join(' ') || 'RSS item'}
			{/snippet}

			{#snippet Value()}
				{[String((rssItemFields.itemIdentity) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((rssItemFields.publishedAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
