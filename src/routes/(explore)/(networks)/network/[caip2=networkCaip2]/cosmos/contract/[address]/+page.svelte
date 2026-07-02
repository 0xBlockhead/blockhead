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
	import CosmosContractView from '$/views/CosmosContractView.svelte'
</script>


<svelte:head>
	<title>Cosmos contract • Blockhead</title>
</svelte:head>


<Page>
	<CosmosContractView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/contract/[address]', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		selection={
			select(EntityType.CosmosContract, data.selector, {
				fields: {
					codeId: true,
					$creator: true,
					$admin: true,
				},
			})
		}
	/>
</Page>
