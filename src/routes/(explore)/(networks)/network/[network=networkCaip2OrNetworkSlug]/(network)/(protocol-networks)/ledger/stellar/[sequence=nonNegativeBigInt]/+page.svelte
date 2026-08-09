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
	import StellarLedgerView from '$/views/StellarLedgerView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar ledger'} • stellar ledger • Blockhead</title>
</svelte:head>


<Page>
	<StellarLedgerView
		selection={
			select(EntityType.StellarLedger, {
				$network: data.selector,
				sequence: BigInt(params.sequence),
			})
		}
	/>
</Page>
