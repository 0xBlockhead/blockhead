<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
</script>


<Page>
	<BlockheadSessionsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadSessions',
		}}
		href={resolve('/~/manage/profiles')}
		id="profiles"
	/>
</Page>
