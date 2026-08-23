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


	// Components
	import Page from '$/components/Page.svelte'
	import CctpMessageView from '$/views/CctpMessageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CctpMessage, data.selector, {
				sources: [
					Source.CircleCctpContracts_Evm,
					Source.CircleCctpContracts_Solana,
					Source.CircleCctpContracts_Stellar,
					Source.CircleCctpIris,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.nonce || 'CCTP message')} • CCTP message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'CCTP message'} • CCTP message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CctpMessage, data.selector, {
				sources: [
					Source.CircleCctpContracts_Evm,
					Source.CircleCctpContracts_Solana,
					Source.CircleCctpContracts_Stellar,
					Source.CircleCctpIris,
				],
			})}

	<CctpMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
