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


	// Components
	import Page from '$/components/Page.svelte'
	import SuiPackageVersionView from '$/views/SuiPackageVersionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiPackageVersion, {
				$network: data.selector,
				packageId: params.packageId,
				version: BigInt(params.version),
				digest: params.digest,
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.version) || 'Sui package version')} • Sui package version • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui package version'} • Sui package version • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiPackageVersion, {
				$network: data.selector,
				packageId: params.packageId,
				version: BigInt(params.version),
				digest: params.digest,
			})}

	<SuiPackageVersionView
		selection={pageSelection}
	/>
	{/if}
</Page>
