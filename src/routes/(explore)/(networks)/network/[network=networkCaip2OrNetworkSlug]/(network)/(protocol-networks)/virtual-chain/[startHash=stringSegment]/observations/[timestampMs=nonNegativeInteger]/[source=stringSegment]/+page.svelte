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
	import KaspaVirtualChain_TimestampView from '$/views/KaspaVirtualChain_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'kaspa virtual chain timestamp'} • kaspa virtual chain timestamp • Blockhead</title>
</svelte:head>


<Page>
	<KaspaVirtualChain_TimestampView
		selection={
			select(EntityType.KaspaVirtualChain_Timestamp, {
				$network: data.selector,
				startHash: params.startHash,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
