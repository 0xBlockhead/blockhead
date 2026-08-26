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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EulerEvkVault, data.selector, {
		sources: [
			Source.Euler_Rest,
		],
		fields: {
			name: true,
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EulerEvkVaultView from '$/views/EulerEvkVaultView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Euler EVK vault' : [pageSelection.entity.name, pageSelection.entity.symbol].filter(Boolean).join(' ') || 'Euler EVK vault')} • Euler EVK vault • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Euler EVK vault'} • Euler EVK vault • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EulerEvkVaultView
		selection={pageSelection}
	/>
	{/if}
</Page>
