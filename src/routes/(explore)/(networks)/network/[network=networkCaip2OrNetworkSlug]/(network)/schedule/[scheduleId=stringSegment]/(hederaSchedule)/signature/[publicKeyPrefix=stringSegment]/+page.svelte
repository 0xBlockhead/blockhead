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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaScheduleSignature, {
		$schedule: data.selector,
		publicKeyPrefix: params.publicKeyPrefix,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaScheduleSignatureView from '$/views/HederaScheduleSignatureView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera schedule signature'} • hedera schedule signature • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera schedule signature'} • hedera schedule signature • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaScheduleSignatureView
		selection={pageSelection}
	/>
	{/if}
</Page>
