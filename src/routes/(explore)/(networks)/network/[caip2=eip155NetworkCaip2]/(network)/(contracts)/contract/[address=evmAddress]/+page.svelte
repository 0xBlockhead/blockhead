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
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<svelte:head>
	<title>EVM contract • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		selection={
			select(EntityType.EvmContract, data.selector, {
				fields: {
					precompileName: true,
					$deployer: true,
					$creationTransaction: true,
					$implementation: true,
					$verification: true,
					codeHash: true,
					code: true,
				},
			})
		}
	/>
</Page>
