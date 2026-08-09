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
	import TronContract_TimestampView from '$/views/TronContract_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tron contract timestamp'} • tron contract timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TronContract_TimestampView
		selection={
			select(EntityType.TronContract_Timestamp, {
				$contract: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
