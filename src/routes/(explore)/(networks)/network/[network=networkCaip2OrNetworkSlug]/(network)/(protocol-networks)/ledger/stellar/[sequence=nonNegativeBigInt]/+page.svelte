<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarLedger, {
		$network: data.selector,
		sequence: BigInt(params.sequence),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarLedgerView from '$/views/StellarLedgerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.sequence) || 'stellar ledger')} • stellar ledger • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar ledger'} • stellar ledger • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarLedgerView
		selection={pageSelection}
	/>
	{/if}
</Page>
