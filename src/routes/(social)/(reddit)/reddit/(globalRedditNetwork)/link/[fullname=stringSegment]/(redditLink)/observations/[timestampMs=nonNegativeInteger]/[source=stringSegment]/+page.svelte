<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.RedditLink_Timestamp, {
		$link: {
			fullname: decodeURIComponent(params.fullname),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$link: {
				fullname: decodeURIComponent(params.fullname),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			score: true,
			commentCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLink_TimestampView from '$/views/RedditLink_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(String(pageSelection.entitySelector.timestampMs) || 'Reddit submission timestamp')} • Reddit submission timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RedditLink_TimestampView
		selection={pageSelection}
	/>
</Page>
