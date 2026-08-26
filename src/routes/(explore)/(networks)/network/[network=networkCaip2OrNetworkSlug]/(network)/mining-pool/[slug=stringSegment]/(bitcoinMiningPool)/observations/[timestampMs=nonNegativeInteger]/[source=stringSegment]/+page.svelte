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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinMiningPool_Timestamp, {
		$pool: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinMiningPool_TimestampView from '$/views/BitcoinMiningPool_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Bitcoin mining pool observation')} • Bitcoin mining pool observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin mining pool observation'} • Bitcoin mining pool observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinMiningPool_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
