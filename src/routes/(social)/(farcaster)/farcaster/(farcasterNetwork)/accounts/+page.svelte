<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
</script>


<svelte:head>
	<title>Farcaster accounts • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadFarcasterAccountConnectionsView
		href={resolve('/farcaster/accounts')}
		title='Farcaster accounts'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadFarcasterAccountConnections',
			}).$$blockheadFarcasterAccountConnections({
				count: true,
			})
		}
		id='blockhead-farcaster-account-connections'
	/>
</Page>
