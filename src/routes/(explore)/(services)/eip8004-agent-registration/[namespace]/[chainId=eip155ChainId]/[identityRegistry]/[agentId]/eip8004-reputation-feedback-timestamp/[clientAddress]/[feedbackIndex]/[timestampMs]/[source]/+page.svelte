<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004ReputationFeedback_TimestampView from '$/views/Eip8004ReputationFeedback_TimestampView.svelte'
</script>


<Page>
	<Eip8004ReputationFeedback_TimestampView
		selection={select(EntityType.Eip8004ReputationFeedback_Timestamp, data.selector)}
	/>
</Page>
