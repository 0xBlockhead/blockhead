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
	import CosmosValidatorView from '$/views/CosmosValidatorView.svelte'
</script>


<Page>
	<CosmosValidatorView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/validator/[operatorAddress]', {
				caip2: params.caip2,
				operatorAddress: params.operatorAddress,
			})
		}
		selection={
			select(EntityType.CosmosValidator, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				operatorAddress: decodeURIComponent(params.operatorAddress),
			}, {
				fields: {
					moniker: true,
					consensusPubkey: true,
					identity: true,
					website: true,
					securityContact: true,
					details: true,
				},
			})
		}
	/>
</Page>
