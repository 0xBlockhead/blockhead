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
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
</script>


<Page>
	<RssFeed_TimestampView
		href={
			resolve('/(social)/(rss)/rss/feed/[feedKey]/(feed)/observations/[timestampMs=nonNegativeInteger]/[source]', {
				feedKey: params.feedKey,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.RssFeed_Timestamp, {
				$feed: {
					feedUrl: decodeURIComponent(params.feedKey),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$feed: {
					feedUrl: decodeURIComponent(params.feedKey),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					reachable: true,
					observedItemCount: true,
					fetchWindowKind: true,
				},
			})
		}
	/>
</Page>
