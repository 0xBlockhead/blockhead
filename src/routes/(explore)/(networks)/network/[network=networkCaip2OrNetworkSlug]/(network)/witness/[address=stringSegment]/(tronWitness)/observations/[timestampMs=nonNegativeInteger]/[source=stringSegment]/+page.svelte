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
	import TronWitness_TimestampView from '$/views/TronWitness_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tron witness timestamp'} • tron witness timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TronWitness_TimestampView
		selection={
			select(EntityType.TronWitness_Timestamp, {
				$witness: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
