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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaNetworkSupply_Timestamp, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNetworkSupply_TimestampView from '$/views/HederaNetworkSupply_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera network supply timestamp'} • hedera network supply timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera network supply timestamp'} • hedera network supply timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaNetworkSupply_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
