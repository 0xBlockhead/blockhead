<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CctpAllowanceView from '$/views/CctpAllowanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CctpAllowance, data.selector, {
				sources: [
					Source.CircleCctpIris,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.token || 'CCTP allowance')} • CCTP allowance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'CCTP allowance'} • CCTP allowance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CctpAllowance, data.selector, {
				sources: [
					Source.CircleCctpIris,
				],
			})}

	<CctpAllowanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
