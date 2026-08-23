<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadMoneroTransferState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.MoneroWalletRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroTransferStateView from '$/views/BlockheadMoneroTransferStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.txHash || 'blockhead monero transfer state')} • blockhead monero transfer state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead monero transfer state'} • blockhead monero transfer state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadMoneroTransferStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
