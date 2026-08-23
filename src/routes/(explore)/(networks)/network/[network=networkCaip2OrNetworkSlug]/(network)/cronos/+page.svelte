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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CronosNetworkProfileView from '$/views/CronosNetworkProfileView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CronosNetworkProfile, {
					$network: data.selector,
				}))}
			<title>{data?.title ?? 'cronos network profile'} • cronos network profile • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'cronos network profile'} • cronos network profile • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CronosNetworkProfile, {
					$network: data.selector,
				}))}

		<CronosNetworkProfileView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
