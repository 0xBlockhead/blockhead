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
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


<svelte:head>
	<title>beacon sync committee • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSyncCommitteeView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/sync-committee/[period=nonNegativeInteger]', {
				caip2: params.caip2,
				period: params.period,
			})
		}
		selection={
			select(EntityType.BeaconSyncCommittee, data.selector, {
				fields: {
					validatorIndices: true,
				},
			})
		}
	/>
</Page>
