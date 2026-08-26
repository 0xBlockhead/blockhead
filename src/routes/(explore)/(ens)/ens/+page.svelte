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
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalEnsNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalEnsNetworkView from '$/views/_GlobalEnsNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ENS'} • ENS • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ENS'} • ENS • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalEnsNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
