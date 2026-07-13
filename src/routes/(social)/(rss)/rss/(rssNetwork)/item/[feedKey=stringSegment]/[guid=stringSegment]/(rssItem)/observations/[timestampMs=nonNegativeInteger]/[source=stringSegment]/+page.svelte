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

	const pageSelection = $derived(select(EntityType.RssItem_Timestamp, {
		$item: {
			feedUrl: decodeURIComponent(params.feedKey),
			guid: decodeURIComponent(params.guid),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$item: {
			feedUrl: decodeURIComponent(params.feedKey),
			guid: decodeURIComponent(params.guid),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}).source],
		fields: {
			title: true,
			link: true,
			publishedAt: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'RSS item observation' : 'RSS item observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import RssItem_TimestampView from '$/views/RssItem_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • RSS item observation • Blockhead</title>
</svelte:head>


<Page>
	<RssItem_TimestampView
		href={
			resolve('/rss/item/[feedKey=stringSegment]/[guid=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				feedKey: params.feedKey,
				guid: params.guid,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
