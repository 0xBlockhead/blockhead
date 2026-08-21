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

	const pageSelection = $derived(select(EntityType.BridgeTransfer, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.transferId || 'bridge transfer')} • bridge transfer • Blockhead</title>
</svelte:head>


<Page>
	<BridgeTransferView
		selection={pageSelection}
	/>
</Page>
