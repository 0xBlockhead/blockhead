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
	import TonNftCollection_TimestampView from '$/views/TonNftCollection_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON NFT collection timestamp'} • TON NFT collection timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TonNftCollection_TimestampView
		selection={
			select(EntityType.TonNftCollection_Timestamp, {
				$collection: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
