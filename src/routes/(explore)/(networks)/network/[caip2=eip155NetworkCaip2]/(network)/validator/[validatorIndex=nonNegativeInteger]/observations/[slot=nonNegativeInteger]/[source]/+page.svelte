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
	import BeaconValidator_TimestampView from '$/views/BeaconValidator_TimestampView.svelte'
</script>


<Page>
	<BeaconValidator_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]/observations/[slot=nonNegativeInteger]/[source]', {
				caip2: params.caip2,
				validatorIndex: params.validatorIndex,
				slot: params.slot,
				source: params.source,
			})
		}
		selection={
			select(EntityType.BeaconValidator_Timestamp, {
				$validator: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					indexInNetwork: Number(params.validatorIndex),
				},
				slot: Number(params.slot),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$validator: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					indexInNetwork: Number(params.validatorIndex),
				},
				slot: Number(params.slot),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					status: true,
					balanceGwei: true,
					effectiveBalanceGwei: true,
					slashed: true,
					activationEligibilityEpoch: true,
					activationEpoch: true,
					exitEpoch: true,
					withdrawableEpoch: true,
					withdrawalCredentials: true,
					finalized: true,
					executionOptimistic: true,
					timestampMs: true,
				},
			})
		}
	/>
</Page>
