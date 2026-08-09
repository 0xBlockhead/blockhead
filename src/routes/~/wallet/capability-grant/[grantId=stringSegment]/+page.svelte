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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadWalletCapabilityGrant, {
		grantId: params.grantId,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletCapabilityGrantView from '$/views/BlockheadWalletCapabilityGrantView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.grantId || 'blockhead wallet capability grant'} • blockhead wallet capability grant • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletCapabilityGrantView
		selection={pageSelection}
	/>
</Page>
