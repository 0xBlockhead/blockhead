<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<svelte:head>
	<title>Media • Blockhead</title>
</svelte:head>


<Page>
	<MediaView
		href={
			resolve('/(explore)/media/[url]', {
				url: params.url,
			})
		}
		selection={
			select(EntityType.Media, data.selector, {
				fields: {
					type: true,
					transport: true,
					hash: true,
				},
			})
		}
	/>
</Page>
