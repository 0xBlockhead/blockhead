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
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


<svelte:head>
	<title>global Swarm access • Blockhead</title>
</svelte:head>


<Page>
	<GlobalSwarmAccessView
		href={resolve('/(explore)/(swarm)/swarm/access')}
		selection={select(EntityType._GlobalSwarmAccess, data.selector)}
	/>
</Page>
