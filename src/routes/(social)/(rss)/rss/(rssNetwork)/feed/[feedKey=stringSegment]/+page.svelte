<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RssFeed, data.selector, {
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
		fields: {
			title: true,
			lastBuildDate: true,
			link: true,
			siteUrl: true,
			language: true,
			description: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? ''), String((pageSelection.entitySelector.feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed')))


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • RSS feed • Blockhead</title>
</svelte:head>


<Page>
	<RssFeedView
		href={
			resolve('/rss/feed/[feedKey=stringSegment]', {
				feedKey: params.feedKey,
			})
		}
		selection={pageSelection}
	/>
</Page>
