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

	const pageSelection = $derived(select(EntityType.BlockheadLocalMediaIngest_Timestamp, {
		$ingest: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadLocalMediaIngest_TimestampView from '$/views/BlockheadLocalMediaIngest_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'local media ingest timestamp' : pageSelection.entity.status || 'local media ingest timestamp')} • local media ingest timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLocalMediaIngest_TimestampView
		selection={pageSelection}
	/>
</Page>
