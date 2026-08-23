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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmTokenTransfer, {
				$log: data.selector,
				indexInLog: Number(params.transferIndex),
			}, {
				sources: [
					Source.Blockscout_Rest,
				],
				fields: {
					standard: true,
					amount: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? `Transfer #${pageSelection.entitySelector.indexInLog}` : (String(pageSelection.entitySelector.indexInLog ?? '') ? 'Transfer #' + String(pageSelection.entitySelector.indexInLog ?? '') : '') || 'Token transfer')} • Token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Token transfer'} • Token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmTokenTransfer, {
				$log: data.selector,
				indexInLog: Number(params.transferIndex),
			}, {
				sources: [
					Source.Blockscout_Rest,
				],
				fields: {
					standard: true,
					amount: true,
				},
			})}

	<EvmTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
