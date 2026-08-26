<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AtprotoPost, data.selector, {
		sources: [
			Source.Atproto_Xrpc,
			Source.Atproto_BskySocial_Xrpc,
		],
		fields: {
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.uri ?? '') || 'AT Protocol post' : (pageSelection.entity.text ?? '') || pageSelection.entitySelector.uri || 'AT Protocol post')} • AT Protocol post • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'AT Protocol post'} • AT Protocol post • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AtprotoPostView
		selection={pageSelection}
	/>
	{/if}
</Page>
