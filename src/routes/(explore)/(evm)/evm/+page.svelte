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
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<svelte:head>
	<title>EVM protocol • Blockhead</title>
</svelte:head>


<Page>
	<EvmProtocolView
		href={resolve('/(explore)/(evm)/evm')}
		selection={
			select(EntityType.EvmProtocol, data.selector, {
				fields: {
					protocolName: true,
					registryLabel: true,
					topology: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
