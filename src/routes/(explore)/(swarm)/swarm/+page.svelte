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
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


<svelte:head>
	<title>Swarm protocol • Blockhead</title>
</svelte:head>


<Page>
	<SwarmProtocolView
		href={resolve('/(explore)/(swarm)/swarm')}
		selection={
			select(EntityType.SwarmProtocol, data.selector, {
				fields: {
					protocolName: true,
					topology: true,
					registryLabel: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
