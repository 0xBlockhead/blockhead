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
	import TezosBaker_TimestampView from '$/views/TezosBaker_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos baker timestamp'} • tezos baker timestamp • Blockhead</title>
</svelte:head>


<Page>
	<TezosBaker_TimestampView
		selection={
			select(EntityType.TezosBaker_Timestamp, {
				$baker: data.selector,
				level: BigInt(params.level),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
