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

	const pageSelection = $derived(select(EntityType.FilecoinSector_Timestamp, {
		$sector: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinSector_TimestampView from '$/views/FilecoinSector_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'filecoin sector timestamp')} • filecoin sector timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinSector_TimestampView
		selection={pageSelection}
	/>
</Page>
