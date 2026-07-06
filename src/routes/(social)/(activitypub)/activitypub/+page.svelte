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
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<svelte:head>
	<title>global ActivityPub network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalActivityPubNetworkView
		href={resolve('/(social)/(activitypub)/activitypub')}
		selection={select(EntityType._GlobalActivityPubNetwork, data.selector)}
	/>
</Page>
