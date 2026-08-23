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
	import SuiPackageUpgradeView from '$/views/SuiPackageUpgradeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SuiPackageUpgrade, {
					$package: data.selector,
					upgradedPackageId: params.upgradedPackageId,
				}))}
			<title>{data?.title ?? 'Sui package upgrade'} • Sui package upgrade • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Sui package upgrade'} • Sui package upgrade • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SuiPackageUpgrade, {
					$package: data.selector,
					upgradedPackageId: params.upgradedPackageId,
				}))}

		<SuiPackageUpgradeView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
