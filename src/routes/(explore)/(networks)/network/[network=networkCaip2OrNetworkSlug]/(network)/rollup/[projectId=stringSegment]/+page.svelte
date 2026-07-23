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

	const pageSelection = $derived(select(EntityType.EvmRollup, data.selector, {
		fields: {
			name: true,
			type: true,
			category: true,
			hostChain: true,
			$settlementNetwork: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.projectId) ?? '')].filter(Boolean).join(' ') || 'EVM rollup' : [String((({ ...data.selector, ...pageSelection.entity }).name) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).projectId) ?? '')].filter(Boolean).join(' ') || 'EVM rollup'))} • EVM rollup • Blockhead</title>
</svelte:head>


<Page>
	<EvmRollupView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
				network: params.network,
				projectId: params.projectId,
			})
		}
		selection={pageSelection}
	/>
</Page>
