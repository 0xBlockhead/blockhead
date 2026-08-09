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

	const pageSelection = $derived(select(EntityType.OracleFeed, data.selector, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OracleFeedView from '$/views/OracleFeedView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'oracle feed' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.address || 'oracle feed')} • oracle feed • Blockhead</title>
</svelte:head>


<Page>
	<OracleFeedView
		selection={pageSelection}
	/>
</Page>
