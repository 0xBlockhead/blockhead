<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SorobanWasm, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SorobanWasmView from '$/views/SorobanWasmView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'soroban Wasm'} • soroban Wasm • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'soroban Wasm'} • soroban Wasm • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SorobanWasmView
		selection={pageSelection}
	/>
	{/if}
</Page>
