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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmError, {
		hex: params.hex,
	}, {
		sources: [
			Source.Openchain_Rest,
			Source.FourByteDirectory_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.hex || 'EVM error'} • EVM error • Blockhead</title>
</svelte:head>


<Page>
	<EvmErrorView
		selection={pageSelection}
	/>
</Page>
