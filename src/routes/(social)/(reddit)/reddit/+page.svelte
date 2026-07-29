<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalRedditNetwork, data.selector, {
		sources: [
			Source.Reddit_PublicJson,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Reddit'} • Reddit • Blockhead</title>
</svelte:head>


<Page>
	<GlobalRedditNetworkView
		selection={pageSelection}
	/>
</Page>
