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
	import AiProviderApiOperation_TimestampView from '$/views/AiProviderApiOperation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'AI provider API operation timestamp'} • AI provider API operation timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AiProviderApiOperation_TimestampView
		selection={
			select(EntityType.AiProviderApiOperation_Timestamp, {
				$operation: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
