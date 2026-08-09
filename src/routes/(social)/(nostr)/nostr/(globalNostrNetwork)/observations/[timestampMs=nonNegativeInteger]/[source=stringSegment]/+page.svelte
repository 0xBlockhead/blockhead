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

	const pageSelection = $derived(select(EntityType._GlobalNostrNetwork_Timestamp, {
		$hub: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalNostrNetwork_TimestampView from '$/views/_GlobalNostrNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'global Nostr network timestamp')} • global Nostr network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalNostrNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
