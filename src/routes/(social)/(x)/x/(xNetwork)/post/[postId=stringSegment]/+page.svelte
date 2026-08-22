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

	const pageSelection = $derived(select(EntityType.XPost, data.selector, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'X post' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'X post')} • X post • Blockhead</title>
</svelte:head>


<Page>
	<XPostView
		selection={pageSelection}
	/>
</Page>
