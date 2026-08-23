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
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearTransaction, {
					$network: data.selector.$network,
					hash: params.transactionId,
					signerAccountId: params.signerAccountId,
				}, {
					sources: [
						Source.NearRpc_JsonRpc,
						Source.NearBlocks_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.hash || 'near transaction')} • near transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'near transaction'} • near transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NearTransaction, {
					$network: data.selector.$network,
					hash: params.transactionId,
					signerAccountId: params.signerAccountId,
				}, {
					sources: [
						Source.NearRpc_JsonRpc,
						Source.NearBlocks_Rest,
					],
				}))}

		<NearTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
