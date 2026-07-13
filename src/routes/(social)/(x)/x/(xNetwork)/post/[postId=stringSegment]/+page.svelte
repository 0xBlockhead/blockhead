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

	const pageSelection = $derived(select(EntityType.XPost, data.selector, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			text: true,
			createdAt: true,
			$author: true,
			postUrl: true,
			$replyToPost: true,
			$quotedPost: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.text) ?? ''), String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'X post' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).text) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'X post')))


	// Components
	import Page from '$/components/Page.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • X post • Blockhead</title>
</svelte:head>


<Page>
	<XPostView
		href={
			resolve('/x/post/[postId=stringSegment]', {
				postId: params.postId,
			})
		}
		selection={pageSelection}
	/>
</Page>
