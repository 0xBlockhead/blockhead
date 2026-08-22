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

	const pageSelection = $derived(select(EntityType.AptosAccount_Timestamp, {
		$account: data.selector,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosAccount_TimestampView from '$/views/AptosAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.ledgerVersion) || 'aptos account timestamp')} • aptos account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AptosAccount_TimestampView
		selection={pageSelection}
	/>
</Page>
