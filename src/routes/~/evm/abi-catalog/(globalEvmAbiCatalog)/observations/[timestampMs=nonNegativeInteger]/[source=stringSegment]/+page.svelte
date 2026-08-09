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
	import GlobalEvmAbiCatalog_TimestampView from '$/views/_GlobalEvmAbiCatalog_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'global EVM ABI catalog timestamp'} • global EVM ABI catalog timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEvmAbiCatalog_TimestampView
		selection={
			select(EntityType._GlobalEvmAbiCatalog_Timestamp, {
				$hub: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
