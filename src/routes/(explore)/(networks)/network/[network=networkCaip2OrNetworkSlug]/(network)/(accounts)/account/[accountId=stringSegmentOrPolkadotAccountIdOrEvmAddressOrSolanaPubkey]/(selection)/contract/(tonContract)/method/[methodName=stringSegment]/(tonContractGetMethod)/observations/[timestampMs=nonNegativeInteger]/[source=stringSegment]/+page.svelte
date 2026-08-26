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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonContractGetMethod_Timestamp, {
		$method: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TonContractGetMethod_TimestampView from '$/views/TonContractGetMethod_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON contract get method timestamp'} • TON contract get method timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON contract get method timestamp'} • TON contract get method timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonContractGetMethod_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
