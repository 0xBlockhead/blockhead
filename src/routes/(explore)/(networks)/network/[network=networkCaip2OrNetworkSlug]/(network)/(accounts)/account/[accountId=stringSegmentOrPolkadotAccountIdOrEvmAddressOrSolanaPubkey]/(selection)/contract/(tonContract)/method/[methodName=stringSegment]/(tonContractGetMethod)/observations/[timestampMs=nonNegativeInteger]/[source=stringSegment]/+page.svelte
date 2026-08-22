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
	import TonContractGetMethod_TimestampView from '$/views/TonContractGetMethod_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON contract get method timestamp'} • TON contract get method timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TonContractGetMethod_TimestampView
		selection={
			select(EntityType.TonContractGetMethod_Timestamp, {
				$method: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
