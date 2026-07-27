<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
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


	// Components
	import Page from '$/components/Page.svelte'
	import UrlPreview_TimestampView from '$/views/UrlPreview_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'URL preview timestamp' : (pageSelection.entity.title ?? '') || 'URL preview timestamp')} • URL preview timestamp • Blockhead</title>
</svelte:head>


<Page>
	<UrlPreview_TimestampView
		selection={pageSelection}
	/>
</Page>
