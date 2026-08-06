<!-- Generated from APP.ts. -->

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


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Reddit'} • Reddit • Blockhead</title>
</svelte:head>


<Page>
	<GlobalRedditNetworkView
		selection={
			select(EntityType._GlobalRedditNetwork, data.selector, {
				sources: [
					Source.Reddit_PublicJson,
					Source.Reddit_Rest,
				],
			})
		}
	/>
</Page>
