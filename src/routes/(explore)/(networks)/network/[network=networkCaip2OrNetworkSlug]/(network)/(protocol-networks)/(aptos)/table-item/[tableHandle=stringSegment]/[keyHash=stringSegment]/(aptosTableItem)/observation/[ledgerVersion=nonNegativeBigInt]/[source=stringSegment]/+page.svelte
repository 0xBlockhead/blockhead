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

	const pageSelection = $derived(select(EntityType.AptosTableItem_Timestamp, {
		$tableItem: data.selector,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosTableItem_TimestampView from '$/views/AptosTableItem_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos table item timestamp')} • aptos table item timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AptosTableItem_TimestampView
		selection={pageSelection}
	/>
</Page>
