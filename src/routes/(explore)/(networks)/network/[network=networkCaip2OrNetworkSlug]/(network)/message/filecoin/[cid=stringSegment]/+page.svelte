<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessage, data.selector, {
				sources: [
					Source.Filfox_Rest,
					Source.Lotus_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.cid || 'filecoin message')} • filecoin message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message'} • filecoin message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessage, data.selector, {
				sources: [
					Source.Filfox_Rest,
					Source.Lotus_JsonRpc,
				],
			})}

	<FilecoinMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
