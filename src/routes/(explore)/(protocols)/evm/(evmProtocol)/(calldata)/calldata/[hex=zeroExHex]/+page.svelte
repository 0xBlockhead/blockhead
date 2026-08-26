<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmCalldata, {
		hex: params.hex,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.hex || 'EVM calldata'} • EVM calldata • Blockhead</title>
</svelte:head>


<Page>
	<EvmCalldataView
		selection={pageSelection}
	/>
</Page>
