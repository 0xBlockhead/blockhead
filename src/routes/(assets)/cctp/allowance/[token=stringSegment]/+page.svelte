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
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CctpAllowance, data.selector, {
		sources: [
			Source.CircleCctpIris,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CctpAllowanceView from '$/views/CctpAllowanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.token || 'CCTP allowance')} • CCTP allowance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'CCTP allowance'} • CCTP allowance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CctpAllowanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
