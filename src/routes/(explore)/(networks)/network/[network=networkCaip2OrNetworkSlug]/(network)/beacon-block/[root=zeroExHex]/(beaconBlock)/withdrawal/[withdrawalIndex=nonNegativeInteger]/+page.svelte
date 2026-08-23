<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import BeaconWithdrawalView from '$/views/BeaconWithdrawalView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconWithdrawal, {
					$block: data.selector,
					withdrawalIndex: Number(params.withdrawalIndex),
				}, {
					sources: [
						Source.Beacon_Rest,
						Source.BeaconchaIn_Rest,
					],
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.withdrawalIndex ?? '') ? 'Withdrawal #' + String(pageSelection.entitySelector.withdrawalIndex ?? '') : '') || 'beacon withdrawal')} • beacon withdrawal • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'beacon withdrawal'} • beacon withdrawal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconWithdrawal, {
					$block: data.selector,
					withdrawalIndex: Number(params.withdrawalIndex),
				}, {
					sources: [
						Source.Beacon_Rest,
						Source.BeaconchaIn_Rest,
					],
				}))}

		<BeaconWithdrawalView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
