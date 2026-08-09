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
	import IcpLedgerBlockView from '$/views/IcpLedgerBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'ICP ledger block'} • ICP ledger block • Blockhead</title>
</svelte:head>


<Page>
	<IcpLedgerBlockView
		selection={select(EntityType.IcpLedgerBlock, data.selector)}
	/>
</Page>
