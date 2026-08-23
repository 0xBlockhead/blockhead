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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TezosEntrypoint, {
		$contract: data.selector,
		entrypointName: params.entrypointName,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TezosEntrypointView from '$/views/TezosEntrypointView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'tezos entrypoint'} • tezos entrypoint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'tezos entrypoint'} • tezos entrypoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TezosEntrypointView
		selection={pageSelection}
	/>
	{/if}
</Page>
