<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.MagnetResolution_Timestamp, {
		magnetUri: params.magnetUri,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MagnetResolution_TimestampView from '$/views/MagnetResolution_TimestampView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.timestampMs) || 'magnet resolution timestamp'} • magnet resolution timestamp • Blockhead</title>
</svelte:head>


<Page>
	<MagnetResolution_TimestampView
		selection={pageSelection}
	/>
</Page>
