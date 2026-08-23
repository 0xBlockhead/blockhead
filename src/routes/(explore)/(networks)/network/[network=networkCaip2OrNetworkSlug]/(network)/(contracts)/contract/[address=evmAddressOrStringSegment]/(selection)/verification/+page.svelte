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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmContractVerification, {
				$contract: data.selector,
			}, {
				fields: {
					match: true,
					runtimeMatch: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'EVM contract verification' : [(pageSelection.entity.match ?? ''), (pageSelection.entity.runtimeMatch ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')} • EVM contract verification • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM contract verification'} • EVM contract verification • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EvmContractVerification, {
				$contract: data.selector,
			}, {
				fields: {
					match: true,
					runtimeMatch: true,
				},
			})}

	<EvmContractVerificationView
		selection={pageSelection}
	/>
	{/if}
</Page>
