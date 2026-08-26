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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CctpMessage, data.selector, {
		sources: [
			Source.CircleCctpContracts_Evm,
			Source.CircleCctpContracts_Solana,
			Source.CircleCctpContracts_Stellar,
			Source.CircleCctpIris,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.nonce || 'CCTP message')} • CCTP message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'CCTP message'} • CCTP message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CctpMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
