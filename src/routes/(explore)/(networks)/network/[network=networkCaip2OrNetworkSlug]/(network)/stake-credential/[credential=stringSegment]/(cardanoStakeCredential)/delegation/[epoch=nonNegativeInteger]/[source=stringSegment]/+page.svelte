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
	import CardanoStakeDelegation_EpochView from '$/views/CardanoStakeDelegation_EpochView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoStakeDelegation_Epoch, {
					$stakeCredential: data.selector,
					epoch: Number(params.epoch),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'Cardano stake delegation epoch'} • Cardano stake delegation epoch • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano stake delegation epoch'} • Cardano stake delegation epoch • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoStakeDelegation_Epoch, {
					$stakeCredential: data.selector,
					epoch: Number(params.epoch),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<CardanoStakeDelegation_EpochView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
