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
	<title>{data.title ?? 'Sui package version'} • Sui package version • Blockhead</title>
</svelte:head>


<Page>
	<SuiPackageVersionView
		selection={
			select(EntityType.SuiPackageVersion, {
				$network: data.selector,
				packageId: params.packageId,
				version: BigInt(params.version),
				digest: params.digest,
			})
		}
	/>
</Page>
