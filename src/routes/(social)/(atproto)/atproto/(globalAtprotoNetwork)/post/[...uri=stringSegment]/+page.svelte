<!-- Generated from APP.ts. Do not edit by hand. -->

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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.uri ?? '') || 'AT Protocol post' : (pageSelection.entity.text ?? '') || pageSelection.entitySelector.uri || 'AT Protocol post')} • AT Protocol post • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostView
		selection={pageSelection}
	/>
</Page>
