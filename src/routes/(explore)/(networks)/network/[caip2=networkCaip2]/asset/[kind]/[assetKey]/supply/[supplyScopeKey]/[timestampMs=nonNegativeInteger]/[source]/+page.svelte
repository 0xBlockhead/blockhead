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
	import AssetSupply_TimestampView from '$/views/AssetSupply_TimestampView.svelte'
</script>


<svelte:head>
	<title>asset supply timestamp • Blockhead</title>
</svelte:head>


<Page>
	<AssetSupply_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/[timestampMs=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				kind: params.kind,
				assetKey: params.assetKey,
				supplyScopeKey: params.supplyScopeKey,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.AssetSupply_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					totalSupply: true,
					circulatingSupply: true,
					classKey: true,
					burnedSupply: true,
					methodology: true,
					$class: true,
				},
			})
		}
	/>
</Page>
