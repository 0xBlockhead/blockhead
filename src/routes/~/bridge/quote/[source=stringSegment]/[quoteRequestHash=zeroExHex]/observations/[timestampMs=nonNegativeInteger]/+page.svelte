<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BridgeRouteQuote_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						fromChainId: true,
						toChainId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'to' : [String(pageSelection.entity.fromChainId), 'to', String(pageSelection.entity.toChainId)].filter(Boolean).join(' ') || 'bridge route quote timestamp')} • bridge route quote timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bridge route quote timestamp'} • bridge route quote timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BridgeRouteQuote_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						fromChainId: true,
						toChainId: true,
					},
				}))}

		<BridgeRouteQuote_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
