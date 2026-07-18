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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RssItem>
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
	import RssItemView from '$/views/RssItemView.svelte'
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
		{@const selection = select(EntityType.RssItem, rssItem[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const rssItemHrefFields = { ...rssItem, ...rssItem[EntityMetaKey.Selector] }}
		<RssItemView
			selection={selection}
			prefetched={rssItemFields}
			href={
				(rssItemHrefFields.itemIdentityKind !== undefined && rssItemHrefFields.itemIdentity !== undefined && rssItemHrefFields.$feed !== undefined && rssItemHrefFields.$feed.feedUrl !== undefined ? resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
					itemIdentityKind: String(rssItemHrefFields.itemIdentityKind ?? ''),
					itemIdentity: encodeURIComponent(String(rssItemHrefFields.itemIdentity ?? '')),
					feedUrl: encodeURIComponent(String(rssItemHrefFields.$feed.feedUrl ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
