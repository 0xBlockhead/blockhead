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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadCashuWalletState, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead Cashu wallet state')} • blockhead Cashu wallet state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu wallet state'} • blockhead Cashu wallet state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadCashuWalletStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
