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

	const pageSelection = $derived(select(EntityType.AptosNetwork_Timestamp, {
		$network: data.selector,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosNetwork_TimestampView from '$/views/AptosNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos network timestamp')} • aptos network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AptosNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
