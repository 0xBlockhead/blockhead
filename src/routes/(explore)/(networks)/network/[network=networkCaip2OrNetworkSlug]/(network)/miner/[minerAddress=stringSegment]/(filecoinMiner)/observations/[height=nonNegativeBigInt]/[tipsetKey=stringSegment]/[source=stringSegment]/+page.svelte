<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin miner timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin miner timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMiner_TimestampView from '$/views/FilecoinMiner_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • filecoin miner timestamp • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinMiner_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
				network: params.network,
				minerAddress: params.minerAddress,
				height: params.height,
				tipsetKey: params.tipsetKey,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
