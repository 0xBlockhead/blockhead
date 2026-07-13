<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Url, data.selector))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.url) ?? '')].filter(Boolean).join(' ') || 'URL' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).url) ?? '')].filter(Boolean).join(' ') || 'URL')))


	// Components
	import Page from '$/components/Page.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • URL • Blockhead</title>
</svelte:head>


<Page>
	<UrlView
		href={
			resolve('/url/[url=absoluteUrl]', {
				url: params.url,
			})
		}
		selection={pageSelection}
	/>
</Page>
