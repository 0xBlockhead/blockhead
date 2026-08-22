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

	const pageSelection = $derived(select(EntityType.BlockheadActionReadinessCheck_Timestamp, {
		$readinessCheck: data.selector,
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
	import BlockheadActionReadinessCheck_TimestampView from '$/views/BlockheadActionReadinessCheck_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action readiness check timestamp' : pageSelection.entity.status || 'blockhead action readiness check timestamp')} • blockhead action readiness check timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadActionReadinessCheck_TimestampView
		selection={pageSelection}
	/>
</Page>
