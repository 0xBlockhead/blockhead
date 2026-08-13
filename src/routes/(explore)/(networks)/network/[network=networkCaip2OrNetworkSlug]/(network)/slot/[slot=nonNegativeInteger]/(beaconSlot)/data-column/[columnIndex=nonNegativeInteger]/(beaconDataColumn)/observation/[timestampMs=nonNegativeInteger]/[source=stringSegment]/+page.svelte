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

	const pageSelection = $derived(select(EntityType.BeaconDataColumn_Timestamp, {
		$dataColumn: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconDataColumn_TimestampView from '$/views/BeaconDataColumn_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'beacon data column custody observation')} • beacon data column custody observation • Blockhead</title>
</svelte:head>


<Page>
	<BeaconDataColumn_TimestampView
		selection={pageSelection}
	/>
</Page>
