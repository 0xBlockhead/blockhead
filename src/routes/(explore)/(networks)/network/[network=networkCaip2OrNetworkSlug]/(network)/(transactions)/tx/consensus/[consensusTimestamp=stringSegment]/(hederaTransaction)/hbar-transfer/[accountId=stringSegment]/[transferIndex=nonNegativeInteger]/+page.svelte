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
	import HederaHbarTransferView from '$/views/HederaHbarTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaHbarTransfer, {
				$transaction: data.selector,
				accountId: params.accountId,
				transferIndex: Number(params.transferIndex),
			})}
		<title>{data?.title ?? 'hedera HBAR transfer'} • hedera HBAR transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera HBAR transfer'} • hedera HBAR transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaHbarTransfer, {
				$transaction: data.selector,
				accountId: params.accountId,
				transferIndex: Number(params.transferIndex),
			})}

	<HederaHbarTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
