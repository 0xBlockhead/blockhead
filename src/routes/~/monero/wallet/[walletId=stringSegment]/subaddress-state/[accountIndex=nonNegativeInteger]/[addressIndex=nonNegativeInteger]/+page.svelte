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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadMoneroSubaddressState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.MoneroWalletRpc_JsonRpc,
		],
		fields: {
			address: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.walletId ?? '') || 'blockhead monero subaddress state' : (pageSelection.entity.address ?? '') || pageSelection.entitySelector.walletId || 'blockhead monero subaddress state')} • blockhead monero subaddress state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead monero subaddress state'} • blockhead monero subaddress state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadMoneroSubaddressStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
