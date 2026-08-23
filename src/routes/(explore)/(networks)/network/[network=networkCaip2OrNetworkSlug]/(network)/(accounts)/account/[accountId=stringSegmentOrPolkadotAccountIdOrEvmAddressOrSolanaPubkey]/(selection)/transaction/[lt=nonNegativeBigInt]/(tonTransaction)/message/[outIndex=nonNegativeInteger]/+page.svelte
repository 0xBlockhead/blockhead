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
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonMessage, {
				$sourceTransaction: data.selector,
				outIndex: Number(params.outIndex),
			})}
		<title>{data?.title ?? 'TON message'} • TON message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON message'} • TON message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonMessage, {
				$sourceTransaction: data.selector,
				outIndex: Number(params.outIndex),
			})}

	<TonMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
