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
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<svelte:head>
	<title>EVM topic • Blockhead</title>
</svelte:head>


<Page>
	<EvmTopicView
		href={
			resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
				hex: params.hex,
			})
		}
		selection={
			select(EntityType.EvmTopic, data.selector, {
				fields: {
					signatures: true,
				},
			})
		}
	/>
</Page>
