<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<BlockheadSessionsView
		href={resolve('/~/sessions')}
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$blockheadSessions' },
			fieldName: '$$blockheadSessions',
		}}
		id="sessions"
	/>
</Page>
