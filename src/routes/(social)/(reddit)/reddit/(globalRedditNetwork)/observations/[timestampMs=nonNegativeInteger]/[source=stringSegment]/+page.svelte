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

	const pageSelection = $derived(select(EntityType._GlobalRedditNetwork_Timestamp, {
		$hub: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalRedditNetwork_TimestampView from '$/views/_GlobalRedditNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'global Reddit network timestamp')} • global Reddit network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<GlobalRedditNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
