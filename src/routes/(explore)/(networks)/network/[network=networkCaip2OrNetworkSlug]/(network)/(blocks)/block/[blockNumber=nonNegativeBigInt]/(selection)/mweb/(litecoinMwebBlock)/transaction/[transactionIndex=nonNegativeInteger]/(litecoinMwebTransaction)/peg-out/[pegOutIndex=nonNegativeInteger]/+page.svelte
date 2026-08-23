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


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebPegOutView from '$/views/LitecoinMwebPegOutView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LitecoinMwebPegOut, {
				$transaction: data.selector,
				pegOutIndex: Number(params.pegOutIndex),
			}, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})}
		<title>{data?.title ?? 'litecoin MWEB peg out'} • litecoin MWEB peg out • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'litecoin MWEB peg out'} • litecoin MWEB peg out • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LitecoinMwebPegOut, {
				$transaction: data.selector,
				pegOutIndex: Number(params.pegOutIndex),
			}, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})}

	<LitecoinMwebPegOutView
		selection={pageSelection}
	/>
	{/if}
</Page>
