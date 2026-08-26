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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadMoneroOutputState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.MoneroWalletRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroOutputStateView from '$/views/BlockheadMoneroOutputStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.txHash || 'blockhead monero output state')} • blockhead monero output state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead monero output state'} • blockhead monero output state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadMoneroOutputStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
