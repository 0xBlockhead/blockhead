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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenApprovalView from '$/views/EvmTokenApprovalView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmTokenApproval, {
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
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Token approval' : [pageSelection.entity.approvalKind, (pageSelection.entity.standard ?? '')].filter(Boolean).join(' ') || 'Token approval')} • Token approval • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Token approval'} • Token approval • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmTokenApproval, {
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
			})}

	<EvmTokenApprovalView
		selection={pageSelection}
	/>
	{/if}
</Page>
