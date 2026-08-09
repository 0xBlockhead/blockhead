<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AssetEligibility, {
		$assetInstance: data.selector,
		$account: {
			caip10: {
				namespace: params.namespace,
				reference: params.reference,
				accountAddress: params.accountAddress,
			},
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetEligibilityView from '$/views/AssetEligibilityView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.timestampMs) || 'asset eligibility')} • asset eligibility • Blockhead</title>
</svelte:head>


<Page>
	<AssetEligibilityView
		selection={pageSelection}
	/>
</Page>
