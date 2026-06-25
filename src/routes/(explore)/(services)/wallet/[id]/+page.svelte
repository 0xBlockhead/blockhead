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
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
</script>


<Page>
	<BlockheadWalletView
		selection={select(EntityType.BlockheadWallet, data.selector)}
	/>
</Page>
