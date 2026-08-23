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
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NetworkUpgrade, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						name: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.upgradeId ?? '') || 'network upgrade' : [pageSelection.entity.name, pageSelection.entitySelector.upgradeId].filter(Boolean).join(' ') || 'network upgrade')} • network upgrade • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'network upgrade'} • network upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.NetworkUpgrade, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						name: true,
					},
				}))}

		<NetworkUpgradeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
