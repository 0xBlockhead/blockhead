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
	import RadicleDelegateView from '$/views/RadicleDelegateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RadicleDelegate, {
					$repository: data.selector,
					did: params.did,
				}))}
			<title>{data?.title ?? 'radicle delegate'} • radicle delegate • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'radicle delegate'} • radicle delegate • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RadicleDelegate, {
					$repository: data.selector,
					did: params.did,
				}))}

		<RadicleDelegateView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
