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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmNetwork_GasFee_Block, data.selector, {
		fields: {
			baseFeePerGas: true,
			legacyGasPrice: true,
			maxPriorityFeePerGas: true,
			gasUsedRatio: true,
			priorityFeeRewardAt50thPercentile: true,
			baseFeePerBlobGas: true,
			blobGasUsedRatio: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Block ' + String(pageSelection.entitySelector.blockNumber ?? '') : ['Block ' + String(pageSelection.entitySelector.blockNumber), (pageSelection.entity.baseFeePerGas != null ? String(pageSelection.entity.baseFeePerGas) + ' wei' : '')].filter(Boolean).join(' ') || 'EVM network gas fee block')} • EVM network gas fee block • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasFee_BlockView
		selection={pageSelection}
	/>
</Page>
