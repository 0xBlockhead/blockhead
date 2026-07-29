<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.Url, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.url || 'URL')} • URL • Blockhead</title>
</svelte:head>


<Page>
	<UrlView
		selection={pageSelection}
	/>
</Page>
