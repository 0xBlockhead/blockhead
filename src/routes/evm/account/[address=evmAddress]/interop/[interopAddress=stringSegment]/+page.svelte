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

	const pageSelection = $derived(select(EntityType.EvmAccount, {
		address: params.address,
		interopAddress: params.interopAddress,
	}, {
		sources: [
			Source.Constants_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.address || 'EVM account'} • EVM account • Blockhead</title>
</svelte:head>


<Page>
	<EvmAccountView
		selection={pageSelection}
	/>
</Page>
