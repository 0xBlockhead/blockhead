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
	import IcpLedgerCanister_TimestampView from '$/views/IcpLedgerCanister_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'ICP ledger canister timestamp'} • ICP ledger canister timestamp • Blockhead</title>
</svelte:head>


<Page>
	<IcpLedgerCanister_TimestampView
		selection={
			select(EntityType.IcpLedgerCanister_Timestamp, {
				$ledger: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
