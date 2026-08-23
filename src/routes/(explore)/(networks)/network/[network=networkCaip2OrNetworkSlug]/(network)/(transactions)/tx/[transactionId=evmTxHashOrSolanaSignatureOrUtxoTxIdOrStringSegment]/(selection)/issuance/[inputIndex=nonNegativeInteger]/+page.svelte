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


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsIssuanceView from '$/views/ElementsIssuanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ElementsIssuance, {
				$transaction: data.selector,
				inputIndex: Number(params.inputIndex),
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.inputIndex) || 'Elements issuance')} • Elements issuance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Elements issuance'} • Elements issuance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ElementsIssuance, {
				$transaction: data.selector,
				inputIndex: Number(params.inputIndex),
			})}

	<ElementsIssuanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
