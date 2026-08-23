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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RadicleDelegate, {
		$repository: data.selector,
		did: params.did,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RadicleDelegateView from '$/views/RadicleDelegateView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'radicle delegate'} • radicle delegate • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'radicle delegate'} • radicle delegate • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RadicleDelegateView
		selection={pageSelection}
	/>
	{/if}
</Page>
