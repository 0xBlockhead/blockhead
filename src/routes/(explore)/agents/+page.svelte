<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentConversationsView from '$/views/BlockheadAgentConversationsView.svelte'
</script>


<Page>
	<BlockheadAgentConversationsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadAgentConversations',
		}}
		href={resolve('/agents')}
		id="agents"
	/>
</Page>
