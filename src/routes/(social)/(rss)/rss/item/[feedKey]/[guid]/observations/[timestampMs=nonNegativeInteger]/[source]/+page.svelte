<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
</script>


<svelte:head>
	<title>RSS item observation • Blockhead</title>
</svelte:head>


<Page>
	<RssItem_TimestampView
		href={
			resolve('/(social)/(rss)/rss/item/[feedKey]/[guid]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				feedKey: params.feedKey,
				guid: params.guid,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.RssItem_Timestamp, data.selector, {
				fields: {
					title: true,
					link: true,
					publishedAt: true,
				},
			})
		}
	/>
</Page>
