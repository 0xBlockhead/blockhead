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
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
</script>


<svelte:head>
	<title>Cosmos network • Blockhead</title>
</svelte:head>


<Page>
	<CosmosNetworkView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
				caip2: params.caip2,
			})
		}
		selection={select(EntityType.CosmosNetwork, data.selector)}
	/>
</Page>
