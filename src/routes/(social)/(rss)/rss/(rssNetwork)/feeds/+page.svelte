<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<svelte:head>
	<title>RSS feeds • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.RssNetwork, {
		scope: 'RssNetwork',
	}).$$rssFeeds}

	<RssFeedsView
		href={resolve('/(social)/(rss)/rss/(rssNetwork)/feeds')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='rss-feeds'
	/>
</Page>
