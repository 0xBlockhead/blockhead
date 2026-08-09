<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AvalancheBlockchain, {
		blockchainId: params.blockchainId,
	}, {
		fields: {
			chainName: true,
			chainAlias: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalancheBlockchainView from '$/views/AvalancheBlockchainView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.blockchainId ?? '') || 'avalanche blockchain' : [(pageSelection.entity.chainName ?? ''), (pageSelection.entity.chainAlias ?? '')].filter(Boolean).join(' ') || pageSelection.entitySelector.blockchainId || 'avalanche blockchain'} • avalanche blockchain • Blockhead</title>
</svelte:head>


<Page>
	<AvalancheBlockchainView
		selection={pageSelection}
	/>
</Page>
