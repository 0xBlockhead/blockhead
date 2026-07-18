<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.UrlPreview_Timestamp, {
		$url: {
			url: decodeURIComponent(params.url),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$url: {
				url: decodeURIComponent(params.url),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			$image: true,
			title: true,
			siteName: true,
			previewStatus: true,
			description: true,
			imageUrl: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? '')].filter(Boolean).join(' ') || 'URL preview timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || 'URL preview timestamp'))


	// Components
	import Page from '$/components/Page.svelte'
	import UrlPreview_TimestampView from '$/views/UrlPreview_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • URL preview timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UrlPreview_TimestampView
		href={
			resolve('/url/[url=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				url: params.url,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
