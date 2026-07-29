<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Media, {
		url: decodeURIComponent(params.url),
	}, {
		fields: {
			type: true,
			transport: true,
			hash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.url || 'Media'} • Media • Blockhead</title>
</svelte:head>


<Page>
	<MediaView
		selection={pageSelection}
	/>
</Page>
