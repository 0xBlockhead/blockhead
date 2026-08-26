<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AssetEligibility, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'asset eligibility')} • asset eligibility • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'asset eligibility'} • asset eligibility • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AssetEligibilityView
		selection={pageSelection}
	/>
	{/if}
</Page>
