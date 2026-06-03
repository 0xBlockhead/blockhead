<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
</script>


<Page>
	<BlockheadSessionsView
		href={resolve('/~/manage/profiles')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$blockheadSessions' },
			fieldName: '$$blockheadSessions',
		}}
		id="profiles"
	/>
</Page>
