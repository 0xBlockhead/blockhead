<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CronosNetworkProfileView from '$/views/CronosNetworkProfileView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'cronos network profile'} • cronos network profile • Blockhead</title>
</svelte:head>


<Page>
	<CronosNetworkProfileView
		selection={
			select(EntityType.CronosNetworkProfile, {
				$network: data.selector,
			})
		}
	/>
</Page>
