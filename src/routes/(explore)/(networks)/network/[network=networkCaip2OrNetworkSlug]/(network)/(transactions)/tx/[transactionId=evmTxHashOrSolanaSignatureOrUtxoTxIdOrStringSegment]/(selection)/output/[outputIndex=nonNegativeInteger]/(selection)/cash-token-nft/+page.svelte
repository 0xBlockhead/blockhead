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

	const pageSelection = $derived(select(EntityType.BitcoinCashCashTokenNft, {
		$output: data.selector,
	}, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			capability: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken NFT' : pageSelection.entity.capability || 'Bitcoin Cash CashToken NFT')} • Bitcoin Cash CashToken NFT • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenNftView
		selection={pageSelection}
	/>
</Page>
