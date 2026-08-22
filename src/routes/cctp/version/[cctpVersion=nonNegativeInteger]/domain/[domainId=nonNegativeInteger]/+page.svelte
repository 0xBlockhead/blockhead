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

	const pageSelection = $derived(select(EntityType.CctpDomainSupport, data.selector, {
		sources: [
			Source.CircleCctpContracts_Evm,
			Source.CircleCctpContracts_Solana,
			Source.CircleCctpContracts_Stellar,
			Source.CircleCctpIris,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'CCTP domain support' : pageSelection.entity.name || 'CCTP domain support')} • CCTP domain support • Blockhead</title>
</svelte:head>


<Page>
	<CctpDomainSupportView
		selection={pageSelection}
	/>
</Page>
