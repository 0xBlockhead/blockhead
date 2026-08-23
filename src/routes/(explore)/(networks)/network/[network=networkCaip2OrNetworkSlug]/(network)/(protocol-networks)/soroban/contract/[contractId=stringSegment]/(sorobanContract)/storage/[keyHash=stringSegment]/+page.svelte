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
	import SorobanContractStorageEntryView from '$/views/SorobanContractStorageEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SorobanContractStorageEntry, data.selector)}
		<title>{data?.title ?? 'soroban contract storage entry'} • soroban contract storage entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'soroban contract storage entry'} • soroban contract storage entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SorobanContractStorageEntry, data.selector)}

	<SorobanContractStorageEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
