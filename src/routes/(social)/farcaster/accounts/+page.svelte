<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
</script>


<Page>
	<BlockheadFarcasterAccountConnectionsView
		href={resolve('/farcaster/accounts')}
		selection={select(
			EntityType._Global,
			{ scope: '$$blockheadFarcasterAccountConnections' }
		).$$blockheadFarcasterAccountConnections}
		id="accounts"
	/>
</Page>
