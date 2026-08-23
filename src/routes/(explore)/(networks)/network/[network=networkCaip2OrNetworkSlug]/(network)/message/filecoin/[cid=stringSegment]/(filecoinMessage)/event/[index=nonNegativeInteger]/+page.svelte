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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinMessageEventView from '$/views/FilecoinMessageEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageEvent, {
				$message: data.selector,
				index: Number(params.index),
			}, {
				sources: [
					Source.Filfox_Rest,
				],
				fields: {
					name: true,
					address: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'filecoin message event' : [(pageSelection.entity.name ?? ''), pageSelection.entity.address].filter(Boolean).join(' ') || 'filecoin message event')} • filecoin message event • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'filecoin message event'} • filecoin message event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FilecoinMessageEvent, {
				$message: data.selector,
				index: Number(params.index),
			}, {
				sources: [
					Source.Filfox_Rest,
				],
				fields: {
					name: true,
					address: true,
				},
			})}

	<FilecoinMessageEventView
		selection={pageSelection}
	/>
	{/if}
</Page>
