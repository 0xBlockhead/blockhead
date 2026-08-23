<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LitecoinMwebPegOut, {
		$transaction: data.selector,
		pegOutIndex: Number(params.pegOutIndex),
	}, {
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebPegOutView from '$/views/LitecoinMwebPegOutView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'litecoin MWEB peg out'} • litecoin MWEB peg out • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'litecoin MWEB peg out'} • litecoin MWEB peg out • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LitecoinMwebPegOutView
		selection={pageSelection}
	/>
	{/if}
</Page>
