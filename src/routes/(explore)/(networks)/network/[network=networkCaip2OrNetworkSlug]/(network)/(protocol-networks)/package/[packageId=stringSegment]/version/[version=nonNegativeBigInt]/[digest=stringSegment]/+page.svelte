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

	const pageSelection = $derived(select(EntityType.SuiPackageVersion, {
		$network: data.selector,
		packageId: params.packageId,
		version: BigInt(params.version),
		digest: params.digest,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiPackageVersionView from '$/views/SuiPackageVersionView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.version) || 'Sui package version')} • Sui package version • Blockhead</title>
</svelte:head>


<Page>
	<SuiPackageVersionView
		selection={pageSelection}
	/>
</Page>
