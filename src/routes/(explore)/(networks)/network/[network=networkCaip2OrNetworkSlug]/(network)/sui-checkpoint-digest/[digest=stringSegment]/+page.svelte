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


	// Components
	import Page from '$/components/Page.svelte'
	import SuiCheckpointView from '$/views/SuiCheckpointView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiCheckpoint, {
				$network: {
					$network: data.selector,
				},
				digest: params.digest,
			})}
		<title>{data?.title ?? 'Sui checkpoint'} • Sui checkpoint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui checkpoint'} • Sui checkpoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiCheckpoint, {
				$network: {
					$network: data.selector,
				},
				digest: params.digest,
			})}

	<SuiCheckpointView
		selection={pageSelection}
	/>
	{/if}
</Page>
