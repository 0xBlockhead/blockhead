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


	// Components
	import Page from '$/components/Page.svelte'
	import TronTokenTransferView from '$/views/TronTokenTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TronTokenTransfer, {
				$network: data.selector,
				transactionId: params.transactionId,
				transferIndex: Number(params.transferIndex),
			})}
		<title>{data?.title ?? 'tron token transfer'} • tron token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tron token transfer'} • tron token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TronTokenTransfer, {
				$network: data.selector,
				transactionId: params.transactionId,
				transferIndex: Number(params.transferIndex),
			})}

	<TronTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
