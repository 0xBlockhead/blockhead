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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmContractSourceBundle, {
		$contract: data.selector,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'EVM contract source bundle'} • EVM contract source bundle • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM contract source bundle'} • EVM contract source bundle • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmContractSourceBundleView
		selection={pageSelection}
	/>
	{/if}
</Page>
