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
	import TezosBaker_Cycle_TimestampView from '$/views/TezosBaker_Cycle_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos baker cycle timestamp'} • tezos baker cycle timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TezosBaker_Cycle_TimestampView
		selection={
			select(EntityType.TezosBaker_Cycle_Timestamp, {
				$baker: data.selector,
				cycle: BigInt(params.cycle),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
