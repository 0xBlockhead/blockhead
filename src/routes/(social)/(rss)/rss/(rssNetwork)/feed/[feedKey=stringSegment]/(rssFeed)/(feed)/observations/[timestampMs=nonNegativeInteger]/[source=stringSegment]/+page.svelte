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

	const pageSelection = $derived(select(EntityType.RssFeed_Timestamp, {
		$feed: {
			feedUrl: decodeURIComponent(params.feedKey),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$feed: {
			feedUrl: decodeURIComponent(params.feedKey),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}).source],
		fields: {
			reachable: true,
			observedItemCount: true,
			fetchWindowKind: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'RSS feed observation' : 'RSS feed observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeed_TimestampView from '$/views/RssFeed_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • RSS feed observation • Blockhead</title>
</svelte:head>


<Page>
	<RssFeed_TimestampView
		href={
			resolve('/rss/feed/[feedKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				feedKey: params.feedKey,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
