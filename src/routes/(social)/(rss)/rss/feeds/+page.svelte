<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		href={resolve('/(social)/(rss)/rss/feeds')}
		title='RSS feeds'
		selection={
			select(EntityType.RssNetwork, {
				scope: 'RssNetwork',
			})[EntityProxyField]<EntityType.RssFeed>('$$rssFeeds')
		}
		id='RssFeedsView-page'
	/>
</Page>
