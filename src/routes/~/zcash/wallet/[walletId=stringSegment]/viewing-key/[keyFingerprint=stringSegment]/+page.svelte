<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadZcashViewingKey, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashdWallet_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZcashViewingKeyView from '$/views/BlockheadZcashViewingKeyView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.keyFingerprint || 'blockhead zcash viewing key')} • blockhead zcash viewing key • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead zcash viewing key'} • blockhead zcash viewing key • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadZcashViewingKeyView
		selection={pageSelection}
	/>
	{/if}
</Page>
