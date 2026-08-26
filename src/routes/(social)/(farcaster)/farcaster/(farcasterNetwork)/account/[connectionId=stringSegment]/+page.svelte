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
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<svelte:head>
	<title>Verified Farcaster connection • Blockhead Farcaster account connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFarcasterAccountConnectionView
		selection={
			select(EntityType.BlockheadFarcasterAccountConnection, {
				connectionId: params.connectionId,
			}, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
