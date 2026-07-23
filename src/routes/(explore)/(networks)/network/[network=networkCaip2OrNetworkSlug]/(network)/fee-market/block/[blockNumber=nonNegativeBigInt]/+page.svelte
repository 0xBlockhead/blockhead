<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
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
	<title>{(data.title ?? (pageSelection.entity == null ? [(String((data.selector.blockNumber) ?? '') ? 'Block ' + String((data.selector.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || 'EVM network gas fee block' : [(String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block ' + String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') : ''), (String((({ ...data.selector, ...pageSelection.entity }).baseFeePerGas) ?? '') ? String((({ ...data.selector, ...pageSelection.entity }).baseFeePerGas) ?? '') + ' wei' : '')].filter(Boolean).join(' ') || 'EVM network gas fee block'))} • EVM network gas fee block • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasFee_BlockView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/fee-market/block/[blockNumber=nonNegativeBigInt]', {
				network: params.network,
				blockNumber: params.blockNumber,
			})
		}
		selection={pageSelection}
	/>
</Page>
