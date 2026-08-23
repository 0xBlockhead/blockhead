<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AssetEligibilityView from '$/views/AssetEligibilityView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetEligibility, {
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
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'asset eligibility')} • asset eligibility • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'asset eligibility'} • asset eligibility • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetEligibility, {
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
				}))}

		<AssetEligibilityView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
