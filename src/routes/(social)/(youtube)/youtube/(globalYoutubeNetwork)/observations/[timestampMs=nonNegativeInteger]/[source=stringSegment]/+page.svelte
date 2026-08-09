<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalYoutubeNetwork_Timestamp, {
		$hub: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalYoutubeNetwork_TimestampView from '$/views/_GlobalYoutubeNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'YouTube hub observation')} • YouTube hub observation • Blockhead</title>
</svelte:head>


<Page>
	<GlobalYoutubeNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
