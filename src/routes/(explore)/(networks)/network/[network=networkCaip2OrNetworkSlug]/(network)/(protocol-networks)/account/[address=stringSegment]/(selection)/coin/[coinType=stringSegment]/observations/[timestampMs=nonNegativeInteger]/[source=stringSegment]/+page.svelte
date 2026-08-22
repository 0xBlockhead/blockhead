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
	import SuiCoinBalance_TimestampView from '$/views/SuiCoinBalance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Sui coin balance timestamp'} • Sui coin balance timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SuiCoinBalance_TimestampView
		selection={
			select(EntityType.SuiCoinBalance_Timestamp, {
				$account: data.selector,
				coinType: params.coinType,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
