<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { MediaTransport, MediaType } from '$/schema/Media.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.url) ?? '')].filter(Boolean).join(' ') || 'Media' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).url) ?? '')].filter(Boolean).join(' ') || 'Media'))


	// Components
	import Page from '$/components/Page.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Media • Blockhead</title>
</svelte:head>


<Page>
	<MediaView
		href={
			resolve('/media/[url=absoluteUrl]', {
				url: params.url,
			})
		}
		selection={pageSelection}
	/>
</Page>
