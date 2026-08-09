<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BridgeTransfer, {
		source: params.source,
		transferId: params.transferId,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.transferId || 'bridge transfer'} • bridge transfer • Blockhead</title>
</svelte:head>


<Page>
	<BridgeTransferView
		selection={pageSelection}
	/>
</Page>
