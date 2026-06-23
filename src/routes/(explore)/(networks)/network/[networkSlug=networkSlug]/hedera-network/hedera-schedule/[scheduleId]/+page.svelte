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
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
</script>


<Page>
	<HederaScheduleView
		selection={select(EntityType.HederaSchedule, data.selector)}
	/>
</Page>
