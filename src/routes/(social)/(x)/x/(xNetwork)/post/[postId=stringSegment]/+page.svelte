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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XPost, data.selector, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'X post' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'X post')} • X post • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'X post'} • X post • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XPostView
		selection={pageSelection}
	/>
	{/if}
</Page>
