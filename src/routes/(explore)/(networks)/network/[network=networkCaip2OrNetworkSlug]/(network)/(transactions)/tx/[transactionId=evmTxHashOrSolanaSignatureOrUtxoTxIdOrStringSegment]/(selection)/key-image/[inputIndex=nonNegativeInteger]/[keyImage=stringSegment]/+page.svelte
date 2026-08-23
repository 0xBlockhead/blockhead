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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import MoneroKeyImageView from '$/views/MoneroKeyImageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MoneroKeyImage, data.selector, {
					sources: [
						Source.MoneroDaemonRpc_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.keyImage || 'monero key image')} • monero key image • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'monero key image'} • monero key image • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.MoneroKeyImage, data.selector, {
					sources: [
						Source.MoneroDaemonRpc_JsonRpc,
					],
				}))}

		<MoneroKeyImageView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
