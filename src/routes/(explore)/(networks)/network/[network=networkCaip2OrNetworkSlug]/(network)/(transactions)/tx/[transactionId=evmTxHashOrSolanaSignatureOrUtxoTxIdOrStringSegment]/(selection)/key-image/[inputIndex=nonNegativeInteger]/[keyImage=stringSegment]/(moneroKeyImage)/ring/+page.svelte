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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MoneroRing, data.selector, {
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'monero ring'} • monero ring • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'monero ring'} • monero ring • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MoneroRingView
		selection={pageSelection}
	/>
	{/if}
</Page>
