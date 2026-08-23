<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import IcpLedgerBlockView from '$/views/IcpLedgerBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.IcpLedgerBlock, data.selector))}
			<title>{data?.title ?? 'ICP ledger block'} • ICP ledger block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ICP ledger block'} • ICP ledger block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.IcpLedgerBlock, data.selector))}

		<IcpLedgerBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
