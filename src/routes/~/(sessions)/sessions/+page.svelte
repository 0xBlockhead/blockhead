<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType._Global,
			{ scope: '$$blockheadSessions' }
		).$$blockheadSessions}
		id="sessions"
	/>
</Page>
