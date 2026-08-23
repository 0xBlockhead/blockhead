<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import TezosEntrypointView from '$/views/TezosEntrypointView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosEntrypoint, {
					$contract: data.selector,
					entrypointName: params.entrypointName,
				}))}
			<title>{data?.title ?? 'tezos entrypoint'} • tezos entrypoint • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'tezos entrypoint'} • tezos entrypoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TezosEntrypoint, {
					$contract: data.selector,
					entrypointName: params.entrypointName,
				}))}

		<TezosEntrypointView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
