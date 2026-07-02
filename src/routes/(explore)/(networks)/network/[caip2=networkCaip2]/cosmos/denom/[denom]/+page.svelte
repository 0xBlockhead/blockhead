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
	import CosmosDenomView from '$/views/CosmosDenomView.svelte'
</script>


<svelte:head>
	<title>Cosmos denom • Blockhead</title>
</svelte:head>


<Page>
	<CosmosDenomView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/denom/[denom]', {
				caip2: params.caip2,
				denom: params.denom,
			})
		}
		selection={
			select(EntityType.CosmosDenom, data.selector, {
				fields: {
					symbol: true,
					display: true,
					base: true,
				},
			})
		}
	/>
</Page>
