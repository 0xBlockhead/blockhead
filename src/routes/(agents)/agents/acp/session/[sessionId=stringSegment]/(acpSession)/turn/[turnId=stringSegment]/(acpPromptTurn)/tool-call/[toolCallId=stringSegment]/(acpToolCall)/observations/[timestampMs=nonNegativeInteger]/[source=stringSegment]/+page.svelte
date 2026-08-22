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

	const pageSelection = $derived(select(EntityType.AcpToolCall_Timestamp, {
		$toolCall: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AcpToolCall_TimestampView from '$/views/AcpToolCall_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ACP tool call timestamp')} • ACP tool call timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AcpToolCall_TimestampView
		selection={pageSelection}
	/>
</Page>
