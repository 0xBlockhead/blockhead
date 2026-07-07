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
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
</script>


<Page>
	<CosmosBlockView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/block/[height=nonNegativeInteger]', {
				caip2: params.caip2,
				height: params.height,
			})
		}
		selection={
			select(EntityType.CosmosBlock, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				height: BigInt(params.height),
			}, {
				fields: {
					transactionCount: true,
					proposerConsensusAddress: true,
					timestampMs: true,
				},
			})
		}
	/>
</Page>
