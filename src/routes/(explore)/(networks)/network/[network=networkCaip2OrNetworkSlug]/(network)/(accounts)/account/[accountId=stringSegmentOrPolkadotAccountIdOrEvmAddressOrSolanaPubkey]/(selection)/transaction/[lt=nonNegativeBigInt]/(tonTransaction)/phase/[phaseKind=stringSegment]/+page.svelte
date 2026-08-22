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


	// Components
	import Page from '$/components/Page.svelte'
	import TonTransactionPhaseView from '$/views/TonTransactionPhaseView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON transaction phase'} • TON transaction phase • Blockhead</title>
</svelte:head>


<Page>
	<TonTransactionPhaseView
		selection={
			select(EntityType.TonTransactionPhase, {
				$transaction: data.selector,
				phaseKind: params.phaseKind,
			})
		}
	/>
</Page>
