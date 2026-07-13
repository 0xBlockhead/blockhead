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

	const pageSelection = $derived(select(EntityType.AtprotoPost_Timestamp, {
		$post: {
			uri: decodeURIComponent(params.uri),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		fields: {
			likeCount: true,
			repostCount: true,
			replyCount: true,
			quoteCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post observation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPost_TimestampView from '$/views/AtprotoPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • AT Protocol post observation • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPost_TimestampView
		href={
			resolve('/atproto/post/[...uri=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
				uri: params.uri,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
