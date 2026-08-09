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
	import PolkadotAssetBalance_TimestampView from '$/views/PolkadotAssetBalance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Polkadot asset balance timestamp'} • Polkadot asset balance timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotAssetBalance_TimestampView
		selection={
			select(EntityType.PolkadotAssetBalance_Timestamp, {
				$account: data.selector,
				$asset: {
					$network: selector.$account.$network,
					assetKind: params.assetKind,
					assetId: params.assetId,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
