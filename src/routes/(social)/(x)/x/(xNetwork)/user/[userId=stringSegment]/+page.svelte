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


	// Components
	import Page from '$/components/Page.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XUser, data.selector, {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
				fields: {
					name: true,
					username: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'X user' : [(pageSelection.entity.name ?? ''), pageSelection.entity.username, pageSelection.entitySelector.id].filter(Boolean).join(' ') || 'X user')} • X user • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'X user'} • X user • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.XUser, data.selector, {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
				fields: {
					name: true,
					username: true,
				},
			})}

	<XUserView
		selection={pageSelection}
	/>
	{/if}
</Page>
