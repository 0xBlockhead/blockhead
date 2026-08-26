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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HyperliquidValidator, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import HyperliquidValidatorView from '$/views/HyperliquidValidatorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hyperliquid validator'} • hyperliquid validator • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid validator'} • hyperliquid validator • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HyperliquidValidatorView
		selection={pageSelection}
	/>
	{/if}
</Page>
