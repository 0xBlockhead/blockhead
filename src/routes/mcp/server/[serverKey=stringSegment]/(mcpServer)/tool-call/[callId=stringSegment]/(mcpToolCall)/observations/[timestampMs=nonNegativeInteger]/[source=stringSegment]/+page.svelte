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

	const pageSelection = $derived(select(EntityType.McpToolCall_Timestamp, {
		$toolCall: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import McpToolCall_TimestampView from '$/views/McpToolCall_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'mcp tool call timestamp')} • mcp tool call timestamp • Blockhead</title>
</svelte:head>


<Page>
	<McpToolCall_TimestampView
		selection={pageSelection}
	/>
</Page>
