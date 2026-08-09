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

	const pageSelection = $derived(select(EntityType.AcpTerminal_Timestamp, {
		$terminal: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpTerminal_TimestampView from '$/views/AcpTerminal_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ACP terminal timestamp')} • ACP terminal timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AcpTerminal_TimestampView
		selection={pageSelection}
	/>
</Page>
