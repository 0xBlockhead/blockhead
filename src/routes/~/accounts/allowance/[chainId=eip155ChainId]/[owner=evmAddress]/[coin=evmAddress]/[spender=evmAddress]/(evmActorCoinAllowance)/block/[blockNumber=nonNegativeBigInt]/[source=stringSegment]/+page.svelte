<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmActorCoinAllowance_Block, {
		$allowance: data.selector,
		blockNumber: BigInt(params.blockNumber),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowance_BlockView from '$/views/EvmActorCoinAllowance_BlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Block ' + String(pageSelection.entitySelector.blockNumber)} • EVM actor coin allowance block • Blockhead</title>
</svelte:head>


<Page>
	<EvmActorCoinAllowance_BlockView
		selection={pageSelection}
	/>
</Page>
