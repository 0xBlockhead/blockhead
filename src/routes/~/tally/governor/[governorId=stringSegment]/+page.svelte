<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.TallyGovernor, data.selector, {
		sources: [
			Source.Tally,
		],
		fields: {
			name: true,
			organizationName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TallyGovernorView from '$/views/TallyGovernorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.governorId ?? '') || 'Tally governor' : [(pageSelection.entity.name ?? ''), (pageSelection.entity.organizationName ?? '')].filter(Boolean).join(' ') || pageSelection.entitySelector.governorId || 'Tally governor')} • Tally governor • Blockhead</title>
</svelte:head>


<Page>
	<TallyGovernorView
		selection={pageSelection}
	/>
</Page>
