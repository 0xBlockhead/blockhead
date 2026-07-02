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
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<svelte:head>
	<title>EVM contract verification • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractVerificationView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]/verification', {
				caip2: params.caip2,
				address: params.address,
			})
		}
		selection={
			select(EntityType.EvmContractVerification, data.selector, {
				fields: {
					match: true,
					runtimeMatch: true,
					creationMatch: true,
					verifiedAtMs: true,
					matchId: true,
					$compilation: true,
					$sourceBundle: true,
				},
			})
		}
	/>
</Page>
