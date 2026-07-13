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

	const pageSelection = $derived(select(EntityType.LensPost, data.selector, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			text: true,
			timestamp: true,
			$author: true,
			isEdited: true,
			isDeleted: true,
			contentUri: true,
			metadataHash: true,
			$commentOn: true,
			$quoteOf: true,
			$repostOf: true,
			$root: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.text) ?? ''), String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'Lens post' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).text) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'Lens post')))


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Lens post • Blockhead</title>
</svelte:head>


<Page>
	<LensPostView
		href={
			resolve('/lens/observations/account/post/[postId=stringSegment]', {
				postId: params.postId,
			})
		}
		selection={pageSelection}
	/>
</Page>
