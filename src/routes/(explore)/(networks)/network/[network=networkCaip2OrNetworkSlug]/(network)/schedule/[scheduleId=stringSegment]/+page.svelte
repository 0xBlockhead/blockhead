<!-- Generated from APP.ts. -->

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


<svelte:head>
	<title>{data.title ?? 'hedera schedule'} • hedera schedule • Blockhead</title>
</svelte:head>


<Page>
	<HederaScheduleView
		selection={select(EntityType.HederaSchedule, data.selector)}
	/>
</Page>
