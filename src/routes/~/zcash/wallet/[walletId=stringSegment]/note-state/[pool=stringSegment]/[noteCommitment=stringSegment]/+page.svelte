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

	const pageSelection = $derived(select(EntityType.BlockheadZcashNoteState, data.selector, {
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadZcashNoteStateView from '$/views/BlockheadZcashNoteStateView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.noteCommitment || 'blockhead zcash note state')} • blockhead zcash note state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadZcashNoteStateView
		selection={pageSelection}
	/>
</Page>
