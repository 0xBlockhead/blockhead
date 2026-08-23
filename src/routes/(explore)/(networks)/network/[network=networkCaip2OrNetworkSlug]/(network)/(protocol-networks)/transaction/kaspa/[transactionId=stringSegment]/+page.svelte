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
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaTransaction, {
					$network: data.selector,
					transactionId: params.transactionId,
				}, {
					sources: [
						Source.KaspaExplorer,
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Rest,
						Source.KaspaNode_Wrpc,
					],
				}))}
			<title>{data?.title ?? 'kaspa transaction'} • kaspa transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'kaspa transaction'} • kaspa transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaTransaction, {
					$network: data.selector,
					transactionId: params.transactionId,
				}, {
					sources: [
						Source.KaspaExplorer,
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Rest,
						Source.KaspaNode_Wrpc,
					],
				}))}

		<KaspaTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
