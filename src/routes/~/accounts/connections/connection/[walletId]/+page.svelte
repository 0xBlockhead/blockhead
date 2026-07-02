<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<svelte:head>
	<title>wallet connection • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletConnectionView
		href={
			resolve('/~/accounts/connections/connection/[walletId]', {
				walletId: params.walletId,
			})
		}
		selection={
			select(EntityType.BlockheadWalletConnection, data.selector, {
				fields: {
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
			})
		}
	/>
</Page>
