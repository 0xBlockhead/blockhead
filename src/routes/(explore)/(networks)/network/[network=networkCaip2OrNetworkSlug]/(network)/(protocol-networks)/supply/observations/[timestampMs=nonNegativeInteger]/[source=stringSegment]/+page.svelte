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
	import HederaNetworkSupply_TimestampView from '$/views/HederaNetworkSupply_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera network supply timestamp'} • hedera network supply timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaNetworkSupply_TimestampView
		selection={
			select(EntityType.HederaNetworkSupply_Timestamp, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
