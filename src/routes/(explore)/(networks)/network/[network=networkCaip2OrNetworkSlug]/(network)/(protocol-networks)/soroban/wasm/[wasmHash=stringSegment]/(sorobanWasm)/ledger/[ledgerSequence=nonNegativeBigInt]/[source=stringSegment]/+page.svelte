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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SorobanWasm_TimestampView from '$/views/SorobanWasm_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SorobanWasm_Timestamp, {
					$wasm: data.selector,
					ledgerSequence: BigInt(params.ledgerSequence),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'soroban Wasm timestamp'} • soroban Wasm timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'soroban Wasm timestamp'} • soroban Wasm timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SorobanWasm_Timestamp, {
					$wasm: data.selector,
					ledgerSequence: BigInt(params.ledgerSequence),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<SorobanWasm_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
