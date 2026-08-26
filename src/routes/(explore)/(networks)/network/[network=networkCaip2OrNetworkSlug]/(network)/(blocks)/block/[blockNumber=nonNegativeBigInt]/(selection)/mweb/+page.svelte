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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LitecoinMwebBlock, data.selector, {
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebBlockView from '$/views/LitecoinMwebBlockView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'litecoin MWEB block'} • litecoin MWEB block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'litecoin MWEB block'} • litecoin MWEB block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LitecoinMwebBlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
