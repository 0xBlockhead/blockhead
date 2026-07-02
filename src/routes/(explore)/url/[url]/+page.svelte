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
	import UrlView from '$/views/UrlView.svelte'
</script>


<svelte:head>
	<title>URL • Blockhead</title>
</svelte:head>


<Page>
	<UrlView
		href={
			resolve('/(explore)/url/[url]', {
				url: params.url,
			})
		}
		selection={select(EntityType.Url, data.selector)}
	/>
</Page>
