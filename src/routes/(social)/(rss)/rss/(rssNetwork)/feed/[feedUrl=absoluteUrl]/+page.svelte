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


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed' : [String((({ ...data.selector, ...pageSelection.entity }).title) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).feedUrl) ?? '')].filter(Boolean).join(' ') || 'RSS feed'))} • RSS feed • Blockhead</title>
</svelte:head>


<Page>
	<RssFeedView
		href={
			resolve('/rss/feed/[feedUrl=absoluteUrl]', {
				feedUrl: params.feedUrl,
			})
		}
		selection={pageSelection}
	/>
</Page>
