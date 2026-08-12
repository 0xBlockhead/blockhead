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

	const pageSelection = $derived(select(EntityType.BlockheadCashuWalletState_Timestamp, {
		$walletState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadCashuWalletState_TimestampView from '$/views/BlockheadCashuWalletState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead Cashu wallet state timestamp')} • blockhead Cashu wallet state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadCashuWalletState_TimestampView
		selection={pageSelection}
	/>
</Page>
