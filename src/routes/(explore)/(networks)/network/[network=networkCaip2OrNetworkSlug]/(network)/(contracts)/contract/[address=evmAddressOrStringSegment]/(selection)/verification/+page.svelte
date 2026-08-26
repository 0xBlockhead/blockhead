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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmContractVerification, {
		$contract: data.selector,
	}, {
		fields: {
			match: true,
			runtimeMatch: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractVerificationView from '$/views/EvmContractVerificationView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'EVM contract verification' : [(pageSelection.entity.match ?? ''), (pageSelection.entity.runtimeMatch ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')} • EVM contract verification • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM contract verification'} • EVM contract verification • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmContractVerificationView
		selection={pageSelection}
	/>
	{/if}
</Page>
