<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aAgentInterfaceView from '$/views/A2aAgentInterfaceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aAgentInterface, {
					$cardSnapshot: data.selector,
					protocolBinding: params.protocolBinding,
					url: decodeURIComponent(params.url),
				}, {
					sources: [],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.protocolBinding || 'A2A agent interface')} • A2A agent interface • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'A2A agent interface'} • A2A agent interface • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aAgentInterface, {
					$cardSnapshot: data.selector,
					protocolBinding: params.protocolBinding,
					url: decodeURIComponent(params.url),
				}, {
					sources: [],
				}))}

		<A2aAgentInterfaceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
