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
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<svelte:head>
	<title>ENS • Blockhead</title>
</svelte:head>


<Page>
	<GlobalEnsNetworkView
		href={resolve('/(explore)/(ens)/ens')}
		selection={
			select(EntityType._GlobalEnsNetwork, data.selector, {
				fields: {
					$registryContract: true,
					$ethRegistrarController: true,
					$reverseRegistrar: true,
					$nameWrapper: true,
				},
			})
		}
	/>
</Page>
