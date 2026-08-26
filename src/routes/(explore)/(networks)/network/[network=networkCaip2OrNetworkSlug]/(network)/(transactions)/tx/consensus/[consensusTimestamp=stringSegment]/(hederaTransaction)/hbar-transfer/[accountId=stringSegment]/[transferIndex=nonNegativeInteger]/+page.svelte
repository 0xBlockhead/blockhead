<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaHbarTransfer, {
		$transaction: data.selector,
		accountId: params.accountId,
		transferIndex: Number(params.transferIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaHbarTransferView from '$/views/HederaHbarTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera HBAR transfer'} • hedera HBAR transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera HBAR transfer'} • hedera HBAR transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaHbarTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
