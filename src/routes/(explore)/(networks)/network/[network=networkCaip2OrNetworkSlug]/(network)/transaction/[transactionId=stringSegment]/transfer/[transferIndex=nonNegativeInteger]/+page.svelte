<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TronTokenTransfer, {
		$network: data.selector,
		transactionId: params.transactionId,
		transferIndex: Number(params.transferIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TronTokenTransferView from '$/views/TronTokenTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tron token transfer'} • tron token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tron token transfer'} • tron token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TronTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
