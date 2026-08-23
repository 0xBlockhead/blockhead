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
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CctpDomainSupport, data.selector, {
				sources: [
					Source.CircleCctpContracts_Evm,
					Source.CircleCctpContracts_Solana,
					Source.CircleCctpContracts_Stellar,
					Source.CircleCctpIris,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'CCTP domain support' : pageSelection.entity.name || 'CCTP domain support')} • CCTP domain support • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'CCTP domain support'} • CCTP domain support • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CctpDomainSupport, data.selector, {
				sources: [
					Source.CircleCctpContracts_Evm,
					Source.CircleCctpContracts_Solana,
					Source.CircleCctpContracts_Stellar,
					Source.CircleCctpIris,
				],
				fields: {
					name: true,
				},
			})}

	<CctpDomainSupportView
		selection={pageSelection}
	/>
	{/if}
</Page>
