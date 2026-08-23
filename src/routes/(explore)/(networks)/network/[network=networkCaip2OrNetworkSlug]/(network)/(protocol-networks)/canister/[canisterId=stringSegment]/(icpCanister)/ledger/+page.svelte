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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpLedgerCanister, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP ledger canister'} • ICP ledger canister • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP ledger canister'} • ICP ledger canister • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpLedgerCanisterView
		selection={pageSelection}
	/>
	{/if}
</Page>
