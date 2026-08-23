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
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinActor, data.selector, {
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.address || 'filecoin actor')} • filecoin actor • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin actor'} • filecoin actor • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinActor, data.selector, {
				sources: [
					Source.Lotus_JsonRpc,
					Source.Filfox_Rest,
				],
			})}

	<FilecoinActorView
		selection={pageSelection}
	/>
	{/if}
</Page>
