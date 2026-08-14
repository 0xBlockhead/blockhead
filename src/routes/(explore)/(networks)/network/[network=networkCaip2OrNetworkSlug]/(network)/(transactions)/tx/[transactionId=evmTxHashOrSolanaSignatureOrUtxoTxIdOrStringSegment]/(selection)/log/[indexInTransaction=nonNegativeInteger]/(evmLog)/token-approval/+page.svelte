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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmTokenApproval, {
		$log: data.selector,
	}, {
		sources: [
			Source.Blockscout_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			approvalKind: true,
			standard: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenApprovalView from '$/views/EvmTokenApprovalView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Token approval' : [pageSelection.entity.approvalKind, (pageSelection.entity.standard ?? '')].filter(Boolean).join(' ') || 'Token approval')} • Token approval • Blockhead</title>
</svelte:head>


<Page>
	<EvmTokenApprovalView
		selection={pageSelection}
	/>
</Page>
