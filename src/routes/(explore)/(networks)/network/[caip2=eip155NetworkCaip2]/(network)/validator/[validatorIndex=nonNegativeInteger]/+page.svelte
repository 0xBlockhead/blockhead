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
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<svelte:head>
	<title>beacon validator • Blockhead</title>
</svelte:head>


<Page>
	<BeaconValidatorView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]', {
				caip2: params.caip2,
				validatorIndex: params.validatorIndex,
			})
		}
		selection={
			select(EntityType.BeaconValidator, data.selector, {
				fields: {
					status: true,
					slashed: true,
					balanceGwei: true,
					effectiveBalanceGwei: true,
				},
			})
		}
	/>
</Page>
