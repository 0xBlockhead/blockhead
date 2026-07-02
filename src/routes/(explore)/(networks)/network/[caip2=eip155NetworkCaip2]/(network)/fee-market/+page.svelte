<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	import EvmNetwork_GasFee_BlocksView from '$/views/EvmNetwork_GasFee_BlocksView.svelte'
</script>


<svelte:head>
	<title>Fee market • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasFee_BlocksView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/fee-market', {
				caip2: params.caip2,
			})
		}
		title='Fee market'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			})[EntityProxyField]<EntityType.EvmNetwork_GasFee_Block>('$$gasFeeBlocks')
		}
		id='EvmNetwork_GasFee_BlocksView-page'
	/>
</Page>
