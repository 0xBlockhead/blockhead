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
	import BlockheadLogosBlockchainWalletKeyState_TimestampView from '$/views/BlockheadLogosBlockchainWalletKeyState_TimestampView.svelte'
</script>


<Page>
	<BlockheadLogosBlockchainWalletKeyState_TimestampView
		selection={select(EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp, data.selector)}
	/>
</Page>
