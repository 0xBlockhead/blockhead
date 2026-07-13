<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalYoutubeNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? ['YouTube'].filter(Boolean).join(' ') || 'YouTube network' : ['YouTube'].filter(Boolean).join(' ') || 'YouTube network')))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalYoutubeNetworkView
		href={resolve('/youtube')}
		selection={pageSelection}
	/>
</Page>
