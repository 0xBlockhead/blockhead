<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmTopicHash } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmTopic, data.selector, {
		sources: [
			Source.Openchain_Rest,
		],
		fields: {
			signatures: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'EVM topic' : 'EVM topic'))} • EVM topic • Blockhead</title>
</svelte:head>


<Page>
	<EvmTopicView
		href={
			resolve('/evm/topic/[hex=evmTopicHash]', {
				hex: params.hex,
			})
		}
		selection={pageSelection}
	/>
</Page>
