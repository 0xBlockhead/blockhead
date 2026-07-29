<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType._GlobalEnsNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			$registryContract: true,
			$ethRegistrarController: true,
			$reverseRegistrar: true,
			$nameWrapper: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'ENS'} • ENS • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEnsNetworkView
		selection={pageSelection}
	/>
</Page>
