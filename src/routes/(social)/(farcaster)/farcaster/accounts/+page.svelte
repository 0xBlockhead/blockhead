<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$blockheadFarcasterAccountConnections' },
			fieldName: '$$blockheadFarcasterAccountConnections',
		}}
		id="accounts"
	/>
</Page>
