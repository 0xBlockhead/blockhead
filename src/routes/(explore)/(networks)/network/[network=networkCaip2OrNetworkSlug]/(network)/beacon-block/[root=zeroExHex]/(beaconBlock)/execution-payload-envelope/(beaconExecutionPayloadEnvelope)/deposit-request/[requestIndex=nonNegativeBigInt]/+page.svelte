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
	import BeaconExecutionDepositRequestView from '$/views/BeaconExecutionDepositRequestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconExecutionDepositRequest, {
					$envelope: data.selector,
					requestIndex: params.requestIndex,
				}, {
					sources: [
						Source.Beacon_Rest,
					],
				}))}
			<title>{data?.title ?? 'Deposit request ' + String(pageSelection.entitySelector.requestIndex)} • Beacon execution deposit request • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Beacon execution deposit request'} • Beacon execution deposit request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconExecutionDepositRequest, {
					$envelope: data.selector,
					requestIndex: params.requestIndex,
				}, {
					sources: [
						Source.Beacon_Rest,
					],
				}))}

		<BeaconExecutionDepositRequestView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
