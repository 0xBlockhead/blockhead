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
	import ZeroGNetwork_TimestampView from '$/views/ZeroGNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'zero g network timestamp'} • zero g network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGNetwork_TimestampView
		selection={
			select(EntityType.ZeroGNetwork_Timestamp, {
				$network: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
