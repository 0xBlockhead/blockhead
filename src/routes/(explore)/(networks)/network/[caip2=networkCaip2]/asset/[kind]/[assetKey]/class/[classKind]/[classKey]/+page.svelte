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
	import AssetClassView from '$/views/AssetClassView.svelte'
</script>


<svelte:head>
	<title>asset class • Blockhead</title>
</svelte:head>


<Page>
	<AssetClassView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]', {
				caip2: params.caip2,
				kind: params.kind,
				assetKey: params.assetKey,
				classKind: params.classKind,
				classKey: params.classKey,
			})
		}
		selection={
			select(EntityType.AssetClass, data.selector, {
				fields: {
					label: true,
					slot: true,
					partition: true,
					series: true,
					maturityMs: true,
					valueDecimals: true,
				},
			})
		}
	/>
</Page>
