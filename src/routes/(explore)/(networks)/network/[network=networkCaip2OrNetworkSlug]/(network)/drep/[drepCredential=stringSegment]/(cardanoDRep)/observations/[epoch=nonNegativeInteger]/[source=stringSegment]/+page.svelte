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
	import CardanoDRep_TimestampView from '$/views/CardanoDRep_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'Cardano DRep timestamp'} • Cardano DRep timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CardanoDRep_TimestampView
		selection={
			select(EntityType.CardanoDRep_Timestamp, {
				$drep: data.selector,
				epoch: Number(params.epoch),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
