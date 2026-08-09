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
	import StarknetTransaction_TimestampView from '$/views/StarknetTransaction_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'starknet transaction timestamp'} • starknet transaction timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StarknetTransaction_TimestampView
		selection={
			select(EntityType.StarknetTransaction_Timestamp, {
				$transaction: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
