<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.LensFeed, data.selector, {
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LensFeedView from '$/views/LensFeedView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'Lens feed' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.address].filter(Boolean).join(' ') || 'Lens feed')} • Lens feed • Blockhead</title>
</svelte:head>


<Page>
	<LensFeedView
		selection={pageSelection}
	/>
</Page>
