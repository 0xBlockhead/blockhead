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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonContract, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TonContractView from '$/views/TonContractView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON contract'} • TON contract • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON contract'} • TON contract • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonContractView
		selection={pageSelection}
	/>
	{/if}
</Page>
