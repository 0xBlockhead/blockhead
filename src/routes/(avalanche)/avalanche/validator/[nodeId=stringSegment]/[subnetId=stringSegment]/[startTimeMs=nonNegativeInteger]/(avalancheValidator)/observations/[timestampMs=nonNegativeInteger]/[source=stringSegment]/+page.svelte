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

	const pageSelection = $derived(select(EntityType.AvalancheValidator_Timestamp, {
		$validator: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheValidator_TimestampView from '$/views/AvalancheValidator_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'avalanche validator timestamp')} • avalanche validator timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AvalancheValidator_TimestampView
		selection={pageSelection}
	/>
</Page>
