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

	const pageSelection = $derived(select(EntityType.EvmTokenTransfer, {
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
	<title>{data.title ?? (pageSelection.entity == null ? `Transfer #${pageSelection.entitySelector.indexInLog}` : (String(pageSelection.entitySelector.indexInLog ?? '') ? 'Transfer #' + String(pageSelection.entitySelector.indexInLog ?? '') : '') || 'Token transfer')} • Token transfer • Blockhead</title>
</svelte:head>


<Page>
	<EvmTokenTransferView
		selection={pageSelection}
	/>
</Page>
