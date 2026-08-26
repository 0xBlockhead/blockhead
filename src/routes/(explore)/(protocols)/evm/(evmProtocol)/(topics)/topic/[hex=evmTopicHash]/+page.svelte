<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<svelte:head>
	<title>EVM topic • EVM topic • Blockhead</title>
</svelte:head>


<Page>
	<EvmTopicView
		selection={
			select(EntityType.EvmTopic, {
				hex: params.hex,
			}, {
				sources: [
					Source.Openchain_Rest,
					Source.FourByteDirectory_Rest,
				],
			})
		}
	/>
</Page>
