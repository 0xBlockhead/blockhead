<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadWalletConnection, {
		connectionKey: params.connectionKey,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$wallet: true,
			status: true,
			protocol: true,
			transportKind: true,
			selected: true,
			connectedAt: true,
			disconnectedAt: true,
			sessionId: true,
			sessionTopic: true,
			error: true,
			$activeAccount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'wallet connection' : 'wallet connection')} • wallet connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletConnectionView
		href={
			resolve('/~/accounts/connections/[connectionKey=stringSegment]', {
				connectionKey: params.connectionKey,
			})
		}
		selection={pageSelection}
	/>
</Page>
