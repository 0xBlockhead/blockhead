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


	// Components
	import Page from '$/components/Page.svelte'
	import SorobanContractView from '$/views/SorobanContractView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SorobanContract, data.selector)}
		<title>{data?.title ?? 'soroban contract'} • soroban contract • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'soroban contract'} • soroban contract • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SorobanContract, data.selector)}

	<SorobanContractView
		selection={pageSelection}
	/>
	{/if}
</Page>
