<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<Page>
	<AssetInstanceView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
				caip2: params.caip2,
				kind: params.kind,
				assetKey: params.assetKey,
			})
		}
		selection={
			select(EntityType.AssetInstance, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				kind: decodeURIComponent(params.kind),
				assetKey: decodeURIComponent(params.assetKey),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					symbol: true,
					name: true,
					coinId: true,
					decimals: true,
					$icon: true,
				},
			})
		}
	/>
</Page>
