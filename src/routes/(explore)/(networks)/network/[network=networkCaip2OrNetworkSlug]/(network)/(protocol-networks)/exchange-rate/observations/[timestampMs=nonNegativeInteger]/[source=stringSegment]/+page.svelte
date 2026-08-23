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
	import HederaNetworkExchangeRate_TimestampView from '$/views/HederaNetworkExchangeRate_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaNetworkExchangeRate_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? 'hedera network exchange rate timestamp'} • hedera network exchange rate timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera network exchange rate timestamp'} • hedera network exchange rate timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaNetworkExchangeRate_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}

		<HederaNetworkExchangeRate_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
