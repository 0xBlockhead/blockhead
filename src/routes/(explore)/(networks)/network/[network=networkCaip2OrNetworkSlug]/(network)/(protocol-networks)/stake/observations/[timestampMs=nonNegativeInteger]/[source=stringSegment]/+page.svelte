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
	import HederaNetworkStake_TimestampView from '$/views/HederaNetworkStake_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera network stake timestamp'} • hedera network stake timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaNetworkStake_TimestampView
		selection={
			select(EntityType.HederaNetworkStake_Timestamp, data.selector, {
				sources: [data.selector.source],
			})
		}
	/>
</Page>
