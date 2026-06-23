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
	import BlockheadCashuWalletState_TimestampView from '$/views/BlockheadCashuWalletState_TimestampView.svelte'
</script>


<Page>
	<BlockheadCashuWalletState_TimestampView
		selection={select(EntityType.BlockheadCashuWalletState_Timestamp, data.selector)}
	/>
</Page>
