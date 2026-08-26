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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BridgeRouteQuote_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			fromChainId: true,
			toChainId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'to' : [String(pageSelection.entity.fromChainId), 'to', String(pageSelection.entity.toChainId)].filter(Boolean).join(' ') || 'bridge route quote timestamp')} • bridge route quote timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bridge route quote timestamp'} • bridge route quote timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BridgeRouteQuote_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
