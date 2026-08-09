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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BitcoinRuneBalance, {
		$address: data.selector,
		$rune: {
			$network: selector.$address.$network,
			runeId: params.runeId,
		},
	}, {
		sources: [
			Source.UniSat_Rest,
		],
		fields: {
			amount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinRuneBalanceView from '$/views/BitcoinRuneBalanceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Bitcoin Rune balance' : pageSelection.entity.amount || 'Bitcoin Rune balance')} • Bitcoin Rune balance • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinRuneBalanceView
		selection={pageSelection}
	/>
</Page>
