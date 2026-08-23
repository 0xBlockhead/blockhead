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


	// Components
	import Page from '$/components/Page.svelte'
	import IcpLedgerAccount_TimestampView from '$/views/IcpLedgerAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpLedgerAccount_Timestamp, {
				$ledger: data.selector,
				owner: params.owner,
				subaccount: params.subaccount,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'ICP ledger account timestamp'} • ICP ledger account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP ledger account timestamp'} • ICP ledger account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpLedgerAccount_Timestamp, {
				$ledger: data.selector,
				owner: params.owner,
				subaccount: params.subaccount,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<IcpLedgerAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
