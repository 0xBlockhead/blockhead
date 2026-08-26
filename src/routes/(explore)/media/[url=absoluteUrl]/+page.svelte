<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Media, {
		url: decodeURIComponent(params.url),
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
