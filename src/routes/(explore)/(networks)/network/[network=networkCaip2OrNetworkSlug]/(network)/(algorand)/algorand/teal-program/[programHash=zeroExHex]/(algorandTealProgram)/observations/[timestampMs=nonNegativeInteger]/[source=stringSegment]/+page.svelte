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
	import AlgorandTealProgram_TimestampView from '$/views/AlgorandTealProgram_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'algorand teal program timestamp'} • algorand teal program timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandTealProgram_TimestampView
		selection={
			select(EntityType.AlgorandTealProgram_Timestamp, {
				$program: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
