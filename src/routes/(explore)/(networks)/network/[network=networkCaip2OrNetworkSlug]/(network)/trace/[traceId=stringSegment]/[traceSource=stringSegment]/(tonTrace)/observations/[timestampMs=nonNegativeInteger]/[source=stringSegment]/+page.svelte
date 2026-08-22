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
	import TonTrace_TimestampView from '$/views/TonTrace_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON trace timestamp'} • TON trace timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TonTrace_TimestampView
		selection={
			select(EntityType.TonTrace_Timestamp, {
				$trace: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
