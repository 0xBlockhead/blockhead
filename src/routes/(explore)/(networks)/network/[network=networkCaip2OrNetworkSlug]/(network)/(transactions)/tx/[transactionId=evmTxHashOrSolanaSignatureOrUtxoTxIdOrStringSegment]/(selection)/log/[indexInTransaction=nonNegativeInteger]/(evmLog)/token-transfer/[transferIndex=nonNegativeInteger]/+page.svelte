<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmTokenTransfer, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? `Transfer #${pageSelection.entitySelector.indexInLog}` : (String(pageSelection.entitySelector.indexInLog ?? '') ? 'Transfer #' + String(pageSelection.entitySelector.indexInLog ?? '') : '') || 'Token transfer')} • Token transfer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Token transfer'} • Token transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmTokenTransferView
		selection={pageSelection}
	/>
	{/if}
</Page>
