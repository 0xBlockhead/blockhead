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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpLedgerAccount_Timestamp, {
		$ledger: data.selector,
		owner: params.owner,
		subaccount: params.subaccount,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpLedgerAccount_TimestampView from '$/views/IcpLedgerAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP ledger account timestamp'} • ICP ledger account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP ledger account timestamp'} • ICP ledger account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpLedgerAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
