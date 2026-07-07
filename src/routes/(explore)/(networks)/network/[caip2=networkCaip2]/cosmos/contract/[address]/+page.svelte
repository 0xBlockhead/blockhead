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
	import CosmosContractView from '$/views/CosmosContractView.svelte'
</script>


<Page>
	<CosmosContractView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/contract/[address]', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		selection={
			select(EntityType.CosmosContract, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				address: decodeURIComponent(params.address),
			}, {
				fields: {
					codeId: true,
					$creator: true,
					$admin: true,
				},
			})
		}
	/>
</Page>
