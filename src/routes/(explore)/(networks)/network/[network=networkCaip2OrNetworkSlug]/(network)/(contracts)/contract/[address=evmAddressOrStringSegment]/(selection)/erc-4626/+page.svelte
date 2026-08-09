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

	const pageSelection = $derived(select(EntityType.Erc4626Vault, data.selector, {
		sources: [
			Source.Blockscout_Rest,
			Source.Defillama_Rest,
			Source.Etherscan_Rest,
			Source.Sourcify_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			name: true,
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'erc4626 vault' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.symbol ?? '')].filter(Boolean).join(' ') || 'erc4626 vault')} • erc4626 vault • Blockhead</title>
</svelte:head>


<Page>
	<Erc4626VaultView
		selection={pageSelection}
	/>
</Page>
