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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SorobanContract, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SorobanContractView from '$/views/SorobanContractView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'soroban contract'} • soroban contract • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'soroban contract'} • soroban contract • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SorobanContractView
		selection={pageSelection}
	/>
	{/if}
</Page>
