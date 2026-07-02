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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<svelte:head>
	<title>Reddit • Blockhead</title>
</svelte:head>


<Page>
	<GlobalRedditNetworkView
		href={resolve('/(social)/(reddit)/reddit')}
		selection={select(EntityType._GlobalRedditNetwork, data.selector)}
	/>
</Page>
