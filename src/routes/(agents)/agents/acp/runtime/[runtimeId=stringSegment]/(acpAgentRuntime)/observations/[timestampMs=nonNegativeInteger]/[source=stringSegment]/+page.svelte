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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AcpAgentRuntime_Timestamp, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'ACP agent runtime timestamp')} • ACP agent runtime timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ACP agent runtime timestamp'} • ACP agent runtime timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AcpAgentRuntime_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
