<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AssetInstancesView from '$/views/AssetInstancesView.svelte'
</script>


<svelte:head>
	<title>Native assets • Blockhead</title>
</svelte:head>


<Page>
	<AssetInstancesView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/native-assets', {
				network: params.network,
			})
		}
		title='Native assets'
		selection={select(EntityType.Network, data.selector).$$nativeAssets}
		id='native-assets'
	/>
</Page>
