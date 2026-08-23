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
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpLedgerCanister, data.selector)}
		<title>{data?.title ?? 'ICP ledger canister'} • ICP ledger canister • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP ledger canister'} • ICP ledger canister • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpLedgerCanister, data.selector)}

	<IcpLedgerCanisterView
		selection={pageSelection}
	/>
	{/if}
</Page>
