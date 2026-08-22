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

	const pageSelection = $derived(select(EntityType.NetworkUpgrade_Timestamp, {
		$upgrade: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkUpgrade_TimestampView from '$/views/NetworkUpgrade_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'network upgrade observation')} • network upgrade observation • Blockhead</title>
</svelte:head>


<Page>
	<NetworkUpgrade_TimestampView
		selection={pageSelection}
	/>
</Page>
