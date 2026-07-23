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

	const pageSelection = $derived(select(EntityType.BeaconSyncCommittee, data.selector, {
		fields: {
			validatorIndices: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String((data.selector.period) ?? '') ? 'Sync committee #' + String((data.selector.period) ?? '') : '') || 'beacon sync committee' : (String((({ ...data.selector, ...pageSelection.entity }).period) ?? '') ? 'Sync committee #' + String((({ ...data.selector, ...pageSelection.entity }).period) ?? '') : '') || 'beacon sync committee'))} • beacon sync committee • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSyncCommitteeView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committee/[period=nonNegativeInteger]', {
				network: params.network,
				period: params.period,
			})
		}
		selection={pageSelection}
	/>
</Page>
