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


	// Components
	import Page from '$/components/Page.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.url) ?? '')].filter(Boolean).join(' ') || 'URL' : [String((({ ...data.selector, ...pageSelection.entity }).url) ?? '')].filter(Boolean).join(' ') || 'URL'))} • URL • Blockhead</title>
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
