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

	const pageSelection = $derived(select(EntityType.MagnetLink, data.selector, {
		fields: {
			displayName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MagnetLinkView from '$/views/MagnetLinkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.magnetUri ?? '') || 'magnet link' : (pageSelection.entity.displayName ?? '') || pageSelection.entitySelector.magnetUri || 'magnet link')} • magnet link • Blockhead</title>
</svelte:head>


<Page>
	<MagnetLinkView
		selection={pageSelection}
	/>
</Page>
