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
	import BlockheadLitecoinMwebWalletState_TimestampView from '$/views/BlockheadLitecoinMwebWalletState_TimestampView.svelte'
</script>


<Page>
	<BlockheadLitecoinMwebWalletState_TimestampView
		selection={select(EntityType.BlockheadLitecoinMwebWalletState_Timestamp, data.selector)}
	/>
</Page>
