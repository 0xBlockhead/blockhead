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


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<svelte:head>
	<title>Feed items • Blockhead</title>
</svelte:head>


<Page>
	<RssItemsView
		href={
			resolve('/rss/feed/[feedUrl=absoluteUrl]/items', {
				feedUrl: params.feedUrl,
			})
		}
		title='Feed items'
		selection={
			select(EntityType.RssFeed, data.selector)
				.$$items({
					sources: [
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					],
				})
		}
		countResource={
			select(EntityType.RssFeed, data.selector)
				.$$items({
					sources: [
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					],
				}).count
		}
		id='items'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
