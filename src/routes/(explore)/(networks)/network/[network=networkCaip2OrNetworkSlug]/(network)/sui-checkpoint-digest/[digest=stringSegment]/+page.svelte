<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiCheckpoint, {
		$network: {
			$network: data.selector,
		},
		digest: params.digest,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiCheckpointView from '$/views/SuiCheckpointView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Sui checkpoint'} • Sui checkpoint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui checkpoint'} • Sui checkpoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiCheckpointView
		selection={pageSelection}
	/>
	{/if}
</Page>
