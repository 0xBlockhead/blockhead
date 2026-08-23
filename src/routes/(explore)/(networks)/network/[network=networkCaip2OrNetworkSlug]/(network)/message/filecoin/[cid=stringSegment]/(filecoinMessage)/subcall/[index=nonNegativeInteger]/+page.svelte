<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import FilecoinMessageSubcallView from '$/views/FilecoinMessageSubcallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinMessageSubcall, {
					$message: data.selector,
					index: Number(params.index),
				}, {
					sources: [
						Source.Filfox_Rest,
						Source.Lotus_JsonRpc,
					],
					fields: {
						method: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message subcall' : pageSelection.entity.method || 'filecoin message subcall')} • filecoin message subcall • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'filecoin message subcall'} • filecoin message subcall • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FilecoinMessageSubcall, {
					$message: data.selector,
					index: Number(params.index),
				}, {
					sources: [
						Source.Filfox_Rest,
						Source.Lotus_JsonRpc,
					],
					fields: {
						method: true,
					},
				}))}

		<FilecoinMessageSubcallView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
