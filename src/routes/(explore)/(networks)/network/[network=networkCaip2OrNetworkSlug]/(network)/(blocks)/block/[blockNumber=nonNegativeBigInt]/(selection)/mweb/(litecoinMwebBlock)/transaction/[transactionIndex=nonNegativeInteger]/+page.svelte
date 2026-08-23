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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LitecoinMwebTransaction, data.selector, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})}
		<title>{data?.title ?? 'litecoin MWEB transaction'} • litecoin MWEB transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'litecoin MWEB transaction'} • litecoin MWEB transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LitecoinMwebTransaction, data.selector, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})}

	<LitecoinMwebTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
