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
	import HederaContractResultView from '$/views/HederaContractResultView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaContractResult, data.selector)}
		<title>{data?.title ?? 'hedera contract result'} • hedera contract result • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera contract result'} • hedera contract result • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaContractResult, data.selector)}

	<HederaContractResultView
		selection={pageSelection}
	/>
	{/if}
</Page>
