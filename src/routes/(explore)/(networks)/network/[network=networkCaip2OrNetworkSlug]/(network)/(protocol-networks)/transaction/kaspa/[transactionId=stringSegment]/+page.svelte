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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.KaspaTransaction, {
		$network: data.selector,
		transactionId: params.transactionId,
	}, {
		sources: [
			Source.KaspaExplorer,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'kaspa transaction'} • kaspa transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'kaspa transaction'} • kaspa transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<KaspaTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
