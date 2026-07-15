<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit submission timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit submission timestamp'))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLink_TimestampView from '$/views/RedditLink_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Reddit submission timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RedditLink_TimestampView
		href={
			resolve('/reddit/link/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				fullname: params.fullname,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
