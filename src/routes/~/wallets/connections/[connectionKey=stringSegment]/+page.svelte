<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<svelte:head>
	<title>wallet connection • wallet connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletConnectionView
		selection={
			select(EntityType.BlockheadWalletConnection, {
				connectionKey: params.connectionKey,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
