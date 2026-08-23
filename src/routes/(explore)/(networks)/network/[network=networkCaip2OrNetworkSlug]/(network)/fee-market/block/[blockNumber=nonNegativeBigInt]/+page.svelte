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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmNetwork_GasFee_Block, data.selector, {
				fields: {
					baseFeePerGas: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Block ' + String(pageSelection.entitySelector.blockNumber ?? '') : ['Block ' + String(pageSelection.entitySelector.blockNumber), (pageSelection.entity.baseFeePerGas != null ? String(pageSelection.entity.baseFeePerGas) + ' wei' : '')].filter(Boolean).join(' ') || 'EVM network gas fee block')} • EVM network gas fee block • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM network gas fee block'} • EVM network gas fee block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmNetwork_GasFee_Block, data.selector, {
				fields: {
					baseFeePerGas: true,
				},
			})}

	<EvmNetwork_GasFee_BlockView
		selection={pageSelection}
	/>
	{/if}
</Page>
