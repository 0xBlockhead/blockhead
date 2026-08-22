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
	import TezosBakingRight_TimestampView from '$/views/TezosBakingRight_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos baking right timestamp'} • tezos baking right timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TezosBakingRight_TimestampView
		selection={
			select(EntityType.TezosBakingRight_Timestamp, {
				$right: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
