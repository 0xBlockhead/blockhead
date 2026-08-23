<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import LitecoinMwebPegInView from '$/views/LitecoinMwebPegInView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LitecoinMwebPegIn, {
					$transaction: data.selector,
					pegInIndex: Number(params.pegInIndex),
				}, {
					sources: [
						Source.LitecoinCore_JsonRpc,
					],
				}))}
			<title>{data?.title ?? 'litecoin MWEB peg in'} • litecoin MWEB peg in • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'litecoin MWEB peg in'} • litecoin MWEB peg in • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LitecoinMwebPegIn, {
					$transaction: data.selector,
					pegInIndex: Number(params.pegInIndex),
				}, {
					sources: [
						Source.LitecoinCore_JsonRpc,
					],
				}))}

		<LitecoinMwebPegInView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
