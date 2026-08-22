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

	const pageSelection = $derived(select(EntityType.AcpAgentRuntime_Timestamp, {
		$runtime: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentRuntime_TimestampView from '$/views/AcpAgentRuntime_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ACP agent runtime timestamp')} • ACP agent runtime timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AcpAgentRuntime_TimestampView
		selection={pageSelection}
	/>
</Page>
