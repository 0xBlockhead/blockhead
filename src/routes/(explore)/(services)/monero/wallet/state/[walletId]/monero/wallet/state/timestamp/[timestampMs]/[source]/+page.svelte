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
	import BlockheadMoneroWalletState_TimestampView from '$/views/BlockheadMoneroWalletState_TimestampView.svelte'
</script>


<Page>
	<BlockheadMoneroWalletState_TimestampView
		selection={select(EntityType.BlockheadMoneroWalletState_Timestamp, data.selector)}
	/>
</Page>
