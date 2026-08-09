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

	const pageSelection = $derived(select(EntityType.BlockheadZcashViewingKey, data.selector, {
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
	<title>{data.title ?? (pageSelection.entitySelector.keyFingerprint || 'blockhead zcash viewing key')} • blockhead zcash viewing key • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadZcashViewingKeyView
		selection={pageSelection}
	/>
</Page>
