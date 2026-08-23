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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiPackageUpgrade, {
		$package: data.selector,
		upgradedPackageId: params.upgradedPackageId,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiPackageUpgradeView from '$/views/SuiPackageUpgradeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Sui package upgrade'} • Sui package upgrade • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui package upgrade'} • Sui package upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiPackageUpgradeView
		selection={pageSelection}
	/>
	{/if}
</Page>
