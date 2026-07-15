<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RssItem, data.selector, {
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
		fields: {
			title: true,
			publishedAt: true,
			author: true,
			link: true,
			updatedAt: true,
			enclosureUrl: true,
			commentsUrl: true,
			content: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? ''), String((pageSelection.entitySelector.itemIdentity) ?? '')].filter(Boolean).join(' ') || 'RSS item' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).itemIdentity) ?? '')].filter(Boolean).join(' ') || 'RSS item')))


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • RSS item • Blockhead</title>
</svelte:head>


<Page>
	<RssItemView
		href={
			resolve('/rss/feed/[feedUrl=absoluteUrl]/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', {
				feedUrl: params.feedUrl,
				itemIdentityKind: params.itemIdentityKind,
				itemIdentity: params.itemIdentity,
			})
		}
		selection={pageSelection}
	/>
</Page>
