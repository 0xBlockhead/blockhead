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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NearTransaction, {
		$network: data.selector.$network,
		hash: params.transactionId,
		signerAccountId: params.signerAccountId,
	}, {
		sources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.hash || 'near transaction')} • near transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near transaction'} • near transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NearTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
