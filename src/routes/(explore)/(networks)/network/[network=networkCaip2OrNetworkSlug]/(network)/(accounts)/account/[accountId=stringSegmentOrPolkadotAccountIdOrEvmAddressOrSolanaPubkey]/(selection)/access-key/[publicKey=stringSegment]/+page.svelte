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
	import NearAccessKeyView from '$/views/NearAccessKeyView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearAccessKey, data.selector, {
				sources: [
					Source.NearRpc_JsonRpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'near access key')} • near access key • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near access key'} • near access key • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearAccessKey, data.selector, {
				sources: [
					Source.NearRpc_JsonRpc,
				],
			})}

	<NearAccessKeyView
		selection={pageSelection}
	/>
	{/if}
</Page>
