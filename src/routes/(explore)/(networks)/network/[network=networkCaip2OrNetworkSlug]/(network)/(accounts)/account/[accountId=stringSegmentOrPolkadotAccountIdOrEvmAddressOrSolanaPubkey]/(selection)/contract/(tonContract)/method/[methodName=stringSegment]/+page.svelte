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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TonContractGetMethod, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import TonContractGetMethodView from '$/views/TonContractGetMethodView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'TON contract get method'} • TON contract get method • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON contract get method'} • TON contract get method • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TonContractGetMethodView
		selection={pageSelection}
	/>
	{/if}
</Page>
