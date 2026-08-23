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


	// Components
	import Page from '$/components/Page.svelte'
	import AcpAgentRuntime_TimestampView from '$/views/AcpAgentRuntime_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AcpAgentRuntime_Timestamp, {
				$runtime: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ACP agent runtime timestamp')} • ACP agent runtime timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP agent runtime timestamp'} • ACP agent runtime timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AcpAgentRuntime_Timestamp, {
				$runtime: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<AcpAgentRuntime_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
