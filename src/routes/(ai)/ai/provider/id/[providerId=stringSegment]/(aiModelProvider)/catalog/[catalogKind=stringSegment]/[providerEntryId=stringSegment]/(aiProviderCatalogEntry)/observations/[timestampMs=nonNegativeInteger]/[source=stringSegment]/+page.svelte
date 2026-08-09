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
	import AiProviderCatalogEntry_TimestampView from '$/views/AiProviderCatalogEntry_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'AI provider catalog entry timestamp'} • AI provider catalog entry timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AiProviderCatalogEntry_TimestampView
		selection={
			select(EntityType.AiProviderCatalogEntry_Timestamp, {
				$entry: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
