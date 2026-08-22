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
	import TonContract_TimestampView from '$/views/TonContract_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON contract timestamp'} • TON contract timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TonContract_TimestampView
		selection={
			select(EntityType.TonContract_Timestamp, {
				$contract: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
