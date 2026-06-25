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
	import BlockheadZcashWalletState_TimestampView from '$/views/BlockheadZcashWalletState_TimestampView.svelte'
</script>


<Page>
	<BlockheadZcashWalletState_TimestampView
		selection={select(EntityType.BlockheadZcashWalletState_Timestamp, data.selector)}
	/>
</Page>
