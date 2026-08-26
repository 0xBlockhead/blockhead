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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ElementsIssuance, {
		$transaction: data.selector,
		inputIndex: Number(params.inputIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsIssuanceView from '$/views/ElementsIssuanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.inputIndex) || 'Elements issuance')} • Elements issuance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Elements issuance'} • Elements issuance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ElementsIssuanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
