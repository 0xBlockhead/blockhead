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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XrplAmm_Timestamp, {
		$amm: data.selector,
		ledgerIndex: BigInt(params.ledgerIndex),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmm_TimestampView from '$/views/XrplAmm_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'XRPL AMM timestamp'} • XRPL AMM timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'XRPL AMM timestamp'} • XRPL AMM timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XrplAmm_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
