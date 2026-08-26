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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaNetworkStake_Timestamp, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNetworkStake_TimestampView from '$/views/HederaNetworkStake_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera network stake timestamp'} • hedera network stake timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera network stake timestamp'} • hedera network stake timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaNetworkStake_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
