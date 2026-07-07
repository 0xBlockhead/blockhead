<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosDenomView from '$/views/CosmosDenomView.svelte'
</script>


<Page>
	<CosmosDenomView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/denom/[denom]', {
				caip2: params.caip2,
				denom: params.denom,
			})
		}
		selection={
			select(EntityType.CosmosDenom, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				denom: decodeURIComponent(params.denom),
			}, {
				fields: {
					symbol: true,
					display: true,
					base: true,
				},
			})
		}
	/>
</Page>
