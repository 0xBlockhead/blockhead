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
	<title>{data?.title ?? 'ICP ledger account timestamp'} • ICP ledger account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpLedgerAccount_TimestampView
		selection={
			select(EntityType.IcpLedgerAccount_Timestamp, {
				$ledger: data.selector,
				owner: params.owner,
				subaccount: params.subaccount,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
