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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNodesView from '$/views/LightningNodesView.svelte'
</script>


<svelte:head>
	<title>Nodes • Blockhead</title>
</svelte:head>


<Page>
	<LightningNodesView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes', {
				networkSlug: params.networkSlug,
			})
		}
		title='Nodes'
		selection={
			select(EntityType.LightningNetwork, {
				$network: {
					slug: params.networkSlug,
				},
			}).$$nodes
		}
		id='nodes'
	/>
</Page>
