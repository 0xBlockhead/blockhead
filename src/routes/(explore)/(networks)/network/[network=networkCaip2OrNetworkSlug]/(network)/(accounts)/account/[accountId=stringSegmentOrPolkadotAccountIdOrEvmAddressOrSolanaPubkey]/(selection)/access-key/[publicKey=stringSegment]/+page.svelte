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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NearAccessKey, data.selector, {
		sources: [
			Source.NearRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearAccessKeyView from '$/views/NearAccessKeyView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'near access key')} • near access key • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near access key'} • near access key • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NearAccessKeyView
		selection={pageSelection}
	/>
	{/if}
</Page>
