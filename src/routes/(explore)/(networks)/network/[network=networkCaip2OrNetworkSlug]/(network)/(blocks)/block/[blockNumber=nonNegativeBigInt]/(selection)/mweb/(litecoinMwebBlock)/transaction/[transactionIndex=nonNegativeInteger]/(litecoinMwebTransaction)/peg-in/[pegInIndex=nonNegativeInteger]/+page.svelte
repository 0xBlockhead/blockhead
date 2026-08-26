<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LitecoinMwebPegIn, {
		$transaction: data.selector,
		pegInIndex: Number(params.pegInIndex),
	}, {
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebPegInView from '$/views/LitecoinMwebPegInView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'litecoin MWEB peg in'} • litecoin MWEB peg in • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'litecoin MWEB peg in'} • litecoin MWEB peg in • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LitecoinMwebPegInView
		selection={pageSelection}
	/>
	{/if}
</Page>
