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
	import HederaTokenTransferView from '$/views/HederaTokenTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTokenTransfer, {
				$transaction: data.selector,
				tokenId: params.tokenId,
				accountId: params.accountId,
				transferIndex: Number(params.transferIndex),
			})}
		<title>{data?.title ?? 'hedera token transfer'} • hedera token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera token transfer'} • hedera token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaTokenTransfer, {
				$transaction: data.selector,
				tokenId: params.tokenId,
				accountId: params.accountId,
				transferIndex: Number(params.transferIndex),
			})}

	<HederaTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
