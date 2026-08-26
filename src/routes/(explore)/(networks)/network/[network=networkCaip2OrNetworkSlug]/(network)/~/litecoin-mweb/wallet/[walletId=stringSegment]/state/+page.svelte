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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadLitecoinMwebWalletState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.walletId || 'blockhead litecoin mweb wallet state')} • blockhead litecoin mweb wallet state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead litecoin mweb wallet state'} • blockhead litecoin mweb wallet state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadLitecoinMwebWalletStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
