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

	const pageSelection = $derived(select(EntityType.BlockheadMoneroWalletState_Timestamp, {
		$walletState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadMoneroWalletState_TimestampView from '$/views/BlockheadMoneroWalletState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead monero wallet state timestamp')} • blockhead monero wallet state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadMoneroWalletState_TimestampView
		selection={pageSelection}
	/>
</Page>
