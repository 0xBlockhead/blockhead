<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.FilecoinMiner_Timestamp, {
		$miner: data.selector,
		height: BigInt(params.height),
		tipsetKey: params.tipsetKey,
		source: params.source,
	}, {
		sources: [({
			$miner: data.selector,
			height: BigInt(params.height),
			tipsetKey: params.tipsetKey,
			source: params.source,
		}).source],
		fields: {
			timestampMs: true,
			qualityAdjustedPower: true,
			$tipset: true,
			$owner: true,
			$worker: true,
			peerId: true,
			rawBytePower: true,
			networkRawBytePower: true,
			networkQualityAdjustedPower: true,
			activeSectorCount: true,
			liveSectorCount: true,
			faultySectorCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMiner_TimestampView from '$/views/FilecoinMiner_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'filecoin miner timestamp' : String(pageSelection.entity.timestampMs) || 'filecoin miner timestamp')} • filecoin miner timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMiner_TimestampView
		selection={pageSelection}
	/>
</Page>
