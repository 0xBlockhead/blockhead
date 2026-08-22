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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ElementsIssuance, {
		$transaction: data.selector,
		inputIndex: Number(params.inputIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsIssuanceView from '$/views/ElementsIssuanceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.inputIndex) || 'Elements issuance')} • Elements issuance • Blockhead</title>
</svelte:head>


<Page>
	<ElementsIssuanceView
		selection={pageSelection}
	/>
</Page>
