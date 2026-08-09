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
	import CardanoStakePool_TimestampView from '$/views/CardanoStakePool_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Cardano stake pool timestamp'} • Cardano stake pool timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CardanoStakePool_TimestampView
		selection={
			select(EntityType.CardanoStakePool_Timestamp, {
				$pool: data.selector,
				epoch: Number(params.epoch),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
