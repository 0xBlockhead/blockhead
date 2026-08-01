<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'Lens post' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'Lens post')} • Lens post • Blockhead</title>
</svelte:head>


<Page>
	<LensPostView
		selection={pageSelection}
	/>
</Page>
