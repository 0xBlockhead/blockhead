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
	<title>{data.title ?? 'ICP ledger canister'} • ICP ledger canister • Blockhead</title>
</svelte:head>


<Page>
	<IcpLedgerCanisterView
		selection={select(EntityType.IcpLedgerCanister, data.selector)}
	/>
</Page>
