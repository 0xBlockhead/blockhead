<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
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
			resolve('/(social)/(rss)/rss/feed/[feedKey]/(feed)/items', {
				feedKey: params.feedKey,
			})
		}
		title='Feed items'
		selection={
			select(EntityType.RssFeed, {
				feedUrl: decodeURIComponent(params.feedKey),
			})[EntityProxyField]<EntityType.RssItem>('$$items', {
				sources: [
					Source.Rss_Rest,
					Source.Rss2Json_Rest,
				],
			})
		}
		id='items'
	/>
</Page>
