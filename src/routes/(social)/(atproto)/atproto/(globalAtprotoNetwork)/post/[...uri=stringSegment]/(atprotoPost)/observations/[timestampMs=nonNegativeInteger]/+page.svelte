<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoPost_Timestamp, {
		$post: {
			uri: decodeURIComponent(params.uri),
		},
		timestampMs: Number(params.timestampMs),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPost_TimestampView from '$/views/AtprotoPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.timestampMs) || 'AT Protocol post observation'} • AT Protocol post observation • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPost_TimestampView
		selection={pageSelection}
	/>
</Page>
