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
	import NearActionView from '$/views/NearActionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearAction, {
				$transaction: data.selector,
				actionIndex: Number(params.actionIndex),
			}, {
				sources: [
					Source.NearRpc_JsonRpc,
				],
				fields: {
					actionKind: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'near action' : pageSelection.entity.actionKind || 'near action')} • near action • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near action'} • near action • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearAction, {
				$transaction: data.selector,
				actionIndex: Number(params.actionIndex),
			}, {
				sources: [
					Source.NearRpc_JsonRpc,
				],
				fields: {
					actionKind: true,
				},
			})}

	<NearActionView
		selection={pageSelection}
	/>
	{/if}
</Page>
