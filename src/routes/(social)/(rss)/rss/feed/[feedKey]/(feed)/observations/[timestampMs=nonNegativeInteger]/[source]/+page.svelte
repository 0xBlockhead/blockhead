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
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
</script>


<svelte:head>
	<title>RSS feed observation • Blockhead</title>
</svelte:head>


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
			select(EntityType.RssFeed_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					reachable: true,
					sourceWindowItemCount: true,
					fetchWindowKind: true,
				},
			})
		}
	/>
</Page>
