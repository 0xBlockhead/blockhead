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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
</script>


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
			select(EntityType.RssItem_Timestamp, {
				$item: {
					feedUrl: decodeURIComponent(params.feedKey),
					guid: decodeURIComponent(params.guid),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$item: {
					feedUrl: decodeURIComponent(params.feedKey),
					guid: decodeURIComponent(params.guid),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					title: true,
					link: true,
					publishedAt: true,
				},
			})
		}
	/>
</Page>
