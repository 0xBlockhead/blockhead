<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<svelte:head>
	<title>RSS feeds • Blockhead</title>
</svelte:head>


<Page>
	<RssFeedsView
		href={resolve('/rss/feeds')}
		title='RSS feeds'
		selection={
			select(EntityType.RssNetwork, {
				scope: 'RssNetwork',
			}).$$rssFeeds({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='rss-feeds'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
