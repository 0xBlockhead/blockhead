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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalEvmAbiCatalog_Timestamp, {
		$hub: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEvmAbiCatalog_TimestampView from '$/views/_GlobalEvmAbiCatalog_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'global EVM ABI catalog timestamp'} • global EVM ABI catalog timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global EVM ABI catalog timestamp'} • global EVM ABI catalog timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalEvmAbiCatalog_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
