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


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentDhtLookup_TimestampView from '$/views/BitTorrentDhtLookup_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'mainline DHT lookup'} • mainline DHT lookup • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentDhtLookup_TimestampView
		selection={
			select(EntityType.BitTorrentDhtLookup_Timestamp, {
				$torrent: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
