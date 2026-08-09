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
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar asset'} • stellar asset • Blockhead</title>
</svelte:head>


<Page>
	<StellarAssetView
		selection={
			select(EntityType.StellarAsset, {
				$network: data.selector,
				assetKey: params.assetKey,
			})
		}
	/>
</Page>
