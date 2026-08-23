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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmStateChange, {
		$transaction: data.selector,
		stateChangeKey: decodeURIComponent(params.stateChangeKey),
	}, {
		fields: {
			kind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmStateChangeView from '$/views/EvmStateChangeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'EVM state change' : pageSelection.entity.kind || 'EVM state change')} • EVM state change • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM state change'} • EVM state change • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmStateChangeView
		selection={pageSelection}
	/>
	{/if}
</Page>
