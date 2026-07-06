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
	import LensNetworkView from '$/views/LensNetworkView.svelte'
</script>


<svelte:head>
	<title>Lens • Blockhead</title>
</svelte:head>


<Page>
	<LensNetworkView
		href={resolve('/(social)/(lens)/lens')}
		selection={
			select(EntityType.LensNetwork, data.selector, {
				fields: {
					protocolName: true,
					relationshipModel: true,
					registryName: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
