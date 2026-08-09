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

	const pageSelection = $derived(select(EntityType.NearReceipt, data.selector, {
		sources: [
			Source.NearRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearReceiptView from '$/views/NearReceiptView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.receiptId || 'near receipt')} • near receipt • Blockhead</title>
</svelte:head>


<Page>
	<NearReceiptView
		selection={pageSelection}
	/>
</Page>
