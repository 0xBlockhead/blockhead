<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Coin_TimestampView from '$/views/Coin_TimestampView.svelte'
</script>


<svelte:head>
	<title>coin timestamp • coin timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Coin_TimestampView
		selection={
			select(EntityType.Coin_Timestamp, {
				$coin: {
					coinId: params.coinId,
				},
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
