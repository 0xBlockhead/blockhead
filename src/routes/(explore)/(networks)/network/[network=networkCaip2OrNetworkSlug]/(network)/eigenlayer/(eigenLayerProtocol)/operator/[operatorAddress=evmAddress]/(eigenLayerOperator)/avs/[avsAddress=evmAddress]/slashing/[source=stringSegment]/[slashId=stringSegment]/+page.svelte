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
	import EigenLayerSlashingEventView from '$/views/EigenLayerSlashingEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EigenLayerSlashingEvent, {
					$operator: data.selector,
					$avs: {
						$network: data.selector.$network,
						avsAddress: params.avsAddress,
					},
					source: params.source,
					slashId: params.slashId,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'eigen layer slashing event'} • eigen layer slashing event • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'eigen layer slashing event'} • eigen layer slashing event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EigenLayerSlashingEvent, {
					$operator: data.selector,
					$avs: {
						$network: data.selector.$network,
						avsAddress: params.avsAddress,
					},
					source: params.source,
					slashId: params.slashId,
				}, {
					sources: [params.source],
				}))}

		<EigenLayerSlashingEventView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
