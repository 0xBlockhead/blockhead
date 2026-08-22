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

	const pageSelection = $derived(select(EntityType.EvmNetworkActorCoinBalance_Timestamp, {
		$actorCoin: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalance_TimestampView from '$/views/EvmNetworkActorCoinBalance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.source || 'EVM network actor coin balance timestamp')} • EVM network actor coin balance timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkActorCoinBalance_TimestampView
		selection={pageSelection}
	/>
</Page>
