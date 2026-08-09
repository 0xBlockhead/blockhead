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
	import HederaTopic_TimestampView from '$/views/HederaTopic_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'hedera topic timestamp'} • hedera topic timestamp • Blockhead</title>
</svelte:head>


<Page>
	<HederaTopic_TimestampView
		selection={
			select(EntityType.HederaTopic_Timestamp, {
				$topic: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
