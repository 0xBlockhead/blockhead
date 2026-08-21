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

	const pageSelection = $derived(select(EntityType.ArweaveResource_Timestamp, {
		$resource: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ArweaveResource_TimestampView from '$/views/ArweaveResource_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'arweave resource timestamp')} • arweave resource timestamp • Blockhead</title>
</svelte:head>


<Page>
	<ArweaveResource_TimestampView
		selection={pageSelection}
	/>
</Page>
