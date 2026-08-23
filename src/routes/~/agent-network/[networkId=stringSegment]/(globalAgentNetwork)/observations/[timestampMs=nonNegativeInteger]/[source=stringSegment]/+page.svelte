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
	import GlobalAgentNetwork_TimestampView from '$/views/_GlobalAgentNetwork_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType._GlobalAgentNetwork_Timestamp, {
				$network: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'global agent network timestamp')} • global agent network timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global agent network timestamp'} • global agent network timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType._GlobalAgentNetwork_Timestamp, {
				$network: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<GlobalAgentNetwork_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
