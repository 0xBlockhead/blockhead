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
	import XrplLedgerEntryView from '$/views/XrplLedgerEntryView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'XRPL ledger entry'} • XRPL ledger entry • Blockhead</title>
</svelte:head>


<Page>
	<XrplLedgerEntryView
		selection={
			select(EntityType.XrplLedgerEntry, {
				$ledger: data.selector,
				entryHash: params.entryHash,
			})
		}
	/>
</Page>
