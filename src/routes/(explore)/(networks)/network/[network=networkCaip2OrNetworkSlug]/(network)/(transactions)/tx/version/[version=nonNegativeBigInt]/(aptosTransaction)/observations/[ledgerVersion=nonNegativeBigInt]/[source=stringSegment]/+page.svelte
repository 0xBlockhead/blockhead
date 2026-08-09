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

	const pageSelection = $derived(select(EntityType.AptosTransaction_Timestamp, {
		$transaction: data.selector,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosTransaction_TimestampView from '$/views/AptosTransaction_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos transaction timestamp')} • aptos transaction timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AptosTransaction_TimestampView
		selection={pageSelection}
	/>
</Page>
