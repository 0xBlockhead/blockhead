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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaNetworkFee_Timestamp, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNetworkFee_TimestampView from '$/views/HederaNetworkFee_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera network fee timestamp'} • hedera network fee timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera network fee timestamp'} • hedera network fee timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaNetworkFee_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
