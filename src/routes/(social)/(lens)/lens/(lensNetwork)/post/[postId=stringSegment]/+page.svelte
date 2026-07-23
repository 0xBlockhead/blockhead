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


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.id) ?? '')].filter(Boolean).join(' ') || 'Lens post' : [String((({ ...data.selector, ...pageSelection.entity }).text) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'Lens post'))} • Lens post • Blockhead</title>
</svelte:head>


<Page>
	<LensPostView
		href={
			resolve('/lens/post/[postId=stringSegment]', {
				postId: params.postId,
			})
		}
		selection={pageSelection}
	/>
</Page>
