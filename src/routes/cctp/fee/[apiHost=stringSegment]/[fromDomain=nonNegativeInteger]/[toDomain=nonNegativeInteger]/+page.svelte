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

	const pageSelection = $derived(select(EntityType.CctpFee, {
		apiHost: params.apiHost,
		fromDomain: Number(params.fromDomain),
		toDomain: Number(params.toDomain),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpFeeView from '$/views/CctpFeeView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.apiHost || 'CCTP fee'} • CCTP fee • Blockhead</title>
</svelte:head>


<Page>
	<CctpFeeView
		selection={pageSelection}
	/>
</Page>
