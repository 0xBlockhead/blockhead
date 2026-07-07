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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UrlPreview_TimestampView from '$/views/UrlPreview_TimestampView.svelte'
</script>


<Page>
	<UrlPreview_TimestampView
		href={
			resolve('/(explore)/url/[url]/observations/[timestampMs=nonNegativeInteger]/[source]', {
				url: params.url,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.UrlPreview_Timestamp, {
				$url: {
					url: decodeURIComponent(params.url),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$url: {
					url: decodeURIComponent(params.url),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					$image: true,
					title: true,
					siteName: true,
					previewStatus: true,
					description: true,
					imageUrl: true,
				},
			})
		}
	/>
</Page>
