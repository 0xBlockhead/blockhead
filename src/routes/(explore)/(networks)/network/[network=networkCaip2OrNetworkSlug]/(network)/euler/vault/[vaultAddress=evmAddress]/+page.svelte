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
	import EulerEvkVaultView from '$/views/EulerEvkVaultView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EulerEvkVault, data.selector, {
					sources: [
						Source.Euler_Rest,
					],
					fields: {
						name: true,
						symbol: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Euler EVK vault' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Euler EVK vault')} • Euler EVK vault • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Euler EVK vault'} • Euler EVK vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EulerEvkVault, data.selector, {
					sources: [
						Source.Euler_Rest,
					],
					fields: {
						name: true,
						symbol: true,
					},
				}))}

		<EulerEvkVaultView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
