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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FilecoinActor, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'filecoin actor')} • filecoin actor • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin actor'} • filecoin actor • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FilecoinActorView
		selection={pageSelection}
	/>
	{/if}
</Page>
