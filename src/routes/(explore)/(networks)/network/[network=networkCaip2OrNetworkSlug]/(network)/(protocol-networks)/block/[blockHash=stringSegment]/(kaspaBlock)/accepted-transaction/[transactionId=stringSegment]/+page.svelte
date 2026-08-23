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
	import KaspaAcceptedTransactionView from '$/views/KaspaAcceptedTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaAcceptedTransaction, {
					$acceptingBlock: data.selector,
					$transaction: {
						$network: data.selector.$network,
						transactionId: params.transactionId,
					},
				}, {
					sources: [
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Wrpc,
					],
				}))}
			<title>{data?.title ?? 'kaspa accepted transaction'} • kaspa accepted transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'kaspa accepted transaction'} • kaspa accepted transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.KaspaAcceptedTransaction, {
					$acceptingBlock: data.selector,
					$transaction: {
						$network: data.selector.$network,
						transactionId: params.transactionId,
					},
				}, {
					sources: [
						Source.KaspaNode_Grpc,
						Source.KaspaNode_Wrpc,
					],
				}))}

		<KaspaAcceptedTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
