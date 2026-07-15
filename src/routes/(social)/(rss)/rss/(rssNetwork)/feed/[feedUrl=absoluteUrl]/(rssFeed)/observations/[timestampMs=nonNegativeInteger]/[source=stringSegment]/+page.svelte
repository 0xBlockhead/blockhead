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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RssFeed_Timestamp, {
		$feed: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$feed: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}).source],
		fields: {
			reachable: true,
			observedItemCount: true,
			fetchWindowKind: true,
			error: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? 'RSS feed observation' : 'RSS feed observation')))


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
			resolve('/rss/feed/[feedUrl=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				feedUrl: params.feedUrl,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
