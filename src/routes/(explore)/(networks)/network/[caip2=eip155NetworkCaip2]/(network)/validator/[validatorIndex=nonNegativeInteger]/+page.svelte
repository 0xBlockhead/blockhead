<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
</script>


<Page>
	<BeaconValidatorView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]', {
				caip2: params.caip2,
				validatorIndex: params.validatorIndex,
			})
		}
		selection={
			select(EntityType.BeaconValidator, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				indexInNetwork: Number(params.validatorIndex),
			}, {
				sources: [
					Source.Beacon_Rest,
				],
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
