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

	const pageSelection = $derived(select(EntityType.CelestiaNamespace_Timestamp, {
		$namespace: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CelestiaNamespace_TimestampView from '$/views/CelestiaNamespace_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'celestia namespace timestamp')} • celestia namespace timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CelestiaNamespace_TimestampView
		selection={pageSelection}
	/>
</Page>
