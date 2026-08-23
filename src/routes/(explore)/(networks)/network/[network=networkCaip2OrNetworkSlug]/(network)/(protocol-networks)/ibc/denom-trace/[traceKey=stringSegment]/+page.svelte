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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IbcDenomTrace, data.selector, {
		fields: {
			displayDenom: true,
			baseDenom: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcDenomTraceView from '$/views/IbcDenomTraceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.traceKey ?? '') || 'IBC denom trace' : [(pageSelection.entity.displayDenom ?? ''), (pageSelection.entity.baseDenom ?? ''), pageSelection.entitySelector.traceKey].filter(Boolean).join(' ') || 'IBC denom trace')} • IBC denom trace • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC denom trace'} • IBC denom trace • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IbcDenomTraceView
		selection={pageSelection}
	/>
	{/if}
</Page>
