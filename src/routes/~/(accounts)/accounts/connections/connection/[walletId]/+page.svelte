<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<Page>
	<BlockheadWalletConnectionView selection={select(EntityType.BlockheadWalletConnection, data.selector)} />
</Page>
