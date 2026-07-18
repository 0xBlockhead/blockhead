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
	import LightningNodesView from '$/views/LightningNodesView.svelte'
</script>


<svelte:head>
	<title>Nodes • Blockhead</title>
</svelte:head>


<Page>
	<LightningNodesView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes', {
				network: params.network,
			})
		}
		title='Nodes'
		selection={
			select(EntityType.LightningNetwork, data.selector).$$nodes({
				count: true,
			})
		}
		id='nodes'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
