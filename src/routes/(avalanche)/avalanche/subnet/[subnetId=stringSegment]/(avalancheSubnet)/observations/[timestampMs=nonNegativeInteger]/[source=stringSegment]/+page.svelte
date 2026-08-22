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

	const pageSelection = $derived(select(EntityType.AvalancheSubnet_Timestamp, {
		$subnet: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheSubnet_TimestampView from '$/views/AvalancheSubnet_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'avalanche subnet timestamp')} • avalanche subnet timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AvalancheSubnet_TimestampView
		selection={pageSelection}
	/>
</Page>
