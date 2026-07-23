<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AtprotoPost, data.selector, {
		sources: [
			Source.Atproto_Xrpc,
		],
		fields: {
			text: true,
			createdAt: true,
			$author: true,
			$parent: true,
			$root: true,
			indexedAt: true,
			langs: true,
			selfLabelValues: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.uri) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post' : [String((({ ...data.selector, ...pageSelection.entity }).text) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).uri) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post'))} • AT Protocol post • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostView
		href={
			resolve('/atproto/post/[...uri=stringSegment]', {
				uri: params.uri,
			})
		}
		selection={pageSelection}
	/>
</Page>
