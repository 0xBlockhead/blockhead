<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		hubOpen = true,
	}: {
		hubOpen?: boolean
	} = $props()


	// State
	const hubKey = 'services'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Eip8004ServicesView from '$/views/Eip8004ServicesView.svelte'
</script>


<CollapsibleTabs
	id={`${hubKey}:hub`}
	sectionIdPrefix={hubKey}
	sections={[
		{ id: 'agents', label: 'Agent Services' },
	]}
	{...{ 'data-card': '' }}
	scrollContainerProps={{
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	}}
>
	{#snippet Summary({ open: _summaryOpen })}
		<header
			data-row-item="flexible"
			data-row="wrap gap-4"
		>
			<HeadingComponent>
				Services
			</HeadingComponent>
		</header>
	{/snippet}

	{#snippet SectionAgents({ id, label })}
		<Eip8004ServicesView
			href={resolve('/services')}
			entityFieldReference={{
				entityType: EntityType._Global,
				entityId: {},
				fieldName: '$$eip8004Services',
			}}
			id="agents"
			open={hubOpen}
		/>
	{/snippet}
</CollapsibleTabs>
