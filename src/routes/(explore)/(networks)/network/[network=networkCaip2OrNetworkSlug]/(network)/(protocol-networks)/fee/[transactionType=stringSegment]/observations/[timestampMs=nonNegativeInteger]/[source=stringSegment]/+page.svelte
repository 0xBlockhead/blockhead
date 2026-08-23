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
	import HederaNetworkFee_TimestampView from '$/views/HederaNetworkFee_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaNetworkFee_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? 'hedera network fee timestamp'} • hedera network fee timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera network fee timestamp'} • hedera network fee timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaNetworkFee_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}

		<HederaNetworkFee_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
