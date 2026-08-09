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

	const pageSelection = $derived(select(EntityType.BlockheadWallet, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'blockhead wallet' : pageSelection.entity.name || 'blockhead wallet'} • blockhead wallet • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletView
		selection={pageSelection}
	/>
</Page>
