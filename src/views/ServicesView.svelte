<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		hubOpen = true,
	}: {
		hubOpen?: boolean
	} = $props()

	const hubKey = 'services'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Eip8004RegistrationsView from '$/views/Eip8004RegistrationsView.svelte'
</script>


<CollapsibleTabs
	id={`${hubKey}:hub`}
	sectionIdPrefix={hubKey}
	sections={[
		{ id: 'agents', label: 'ERC-8004 Registrations' },
	]}
	data-card
	scrollContainerProps={{
		'data-row': 'start align-start',
		style: '--carousel-basis: 40ch',
	}}
>
	{#snippet Summary()}
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
		<Eip8004RegistrationsView
			CollapsibleProps={{ canToggle: false }}
			href={resolve('/services')}
			selection={select(
			EntityType._Global,
			{ scope: '$$eip8004Services' }
		).$$eip8004Services}
			id="agents"
			open={hubOpen}
		/>
	{/snippet}
</CollapsibleTabs>
