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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SorobanWasm_Timestamp, {
		$wasm: data.selector,
		ledgerSequence: BigInt(params.ledgerSequence),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SorobanWasm_TimestampView from '$/views/SorobanWasm_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'soroban Wasm timestamp'} • soroban Wasm timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'soroban Wasm timestamp'} • soroban Wasm timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SorobanWasm_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
