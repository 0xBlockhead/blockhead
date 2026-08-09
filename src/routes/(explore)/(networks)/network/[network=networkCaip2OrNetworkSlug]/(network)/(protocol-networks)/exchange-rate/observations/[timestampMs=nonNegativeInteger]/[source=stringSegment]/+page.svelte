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
	import HederaNetworkExchangeRate_TimestampView from '$/views/HederaNetworkExchangeRate_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera network exchange rate timestamp'} • hedera network exchange rate timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaNetworkExchangeRate_TimestampView
		selection={
			select(EntityType.HederaNetworkExchangeRate_Timestamp, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
