<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
	{@const collectionSelection = select(EntityType.RssFeed, data.selector).$$items}

	<RssItemsView
		href={
			resolve(
				'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/items',
				{
					feedUrl: params.feedUrl,
				}
			)
		}
		title='Feed items'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='items'
	/>
</Page>
