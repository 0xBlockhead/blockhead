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

	const pageSelection = $derived(select(EntityType.PolkadotAsset_Timestamp, {
		$asset: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			symbol: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAsset_TimestampView from '$/views/PolkadotAsset_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Polkadot asset timestamp' : [(pageSelection.entity.symbol ?? ''), (pageSelection.entity.name ?? '')].filter(Boolean).join(' ') || 'Polkadot asset timestamp')} • Polkadot asset timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotAsset_TimestampView
		selection={pageSelection}
	/>
</Page>
