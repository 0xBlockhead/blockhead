<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BeaconWithdrawal, {
		$block: data.selector,
		withdrawalIndex: Number(params.withdrawalIndex),
	}, {
		sources: [
			Source.Beacon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconWithdrawalView from '$/views/BeaconWithdrawalView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.withdrawalIndex ?? '') ? 'Withdrawal #' + String(pageSelection.entitySelector.withdrawalIndex ?? '') : '') || 'beacon withdrawal')} • beacon withdrawal • Blockhead</title>
</svelte:head>


<Page>
	<BeaconWithdrawalView
		selection={pageSelection}
	/>
</Page>
