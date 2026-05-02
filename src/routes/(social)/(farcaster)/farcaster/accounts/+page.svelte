<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
</script>


<Page>
	<BlockheadFarcasterAccountConnectionsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadFarcasterAccountConnections',
		}}
		href={resolve('/farcaster/accounts')}
		id="accounts"
	/>
</Page>
