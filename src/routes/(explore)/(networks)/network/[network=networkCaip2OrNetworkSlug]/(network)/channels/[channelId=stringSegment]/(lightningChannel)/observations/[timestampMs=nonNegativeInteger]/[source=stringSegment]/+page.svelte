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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LightningChannel_Timestamp, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannel_TimestampView from '$/views/LightningChannel_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Lightning public channel observation')} • Lightning public channel observation • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannel_TimestampView
		selection={pageSelection}
	/>
</Page>
