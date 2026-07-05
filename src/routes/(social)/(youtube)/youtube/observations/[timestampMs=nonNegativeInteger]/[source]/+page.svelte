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
	import GlobalYoutubeNetwork_TimestampView from '$/views/_GlobalYoutubeNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>YouTube hub observation • Blockhead</title>
</svelte:head>


<Page>
	<GlobalYoutubeNetwork_TimestampView
		href={
			resolve('/(social)/(youtube)/youtube/observations/[timestampMs=nonNegativeInteger]/[source]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType._GlobalYoutubeNetwork_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					sourceWindowChannelCount: true,
					sourceWindowVideoCount: true,
					sourceWindowPlaylistCount: true,
					reachable: true,
				},
			})
		}
	/>
</Page>
