<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import EvmNftsView from '$/views/EvmNftsView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Services • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='services:hub'
		sectionIdPrefix='services'
		sections={[
			{ id: 'agents', label: 'ERC-8004 Registrations' },
		]}
		data-card
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Services</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionAgents()}
			<EvmNftsView
				href={resolve('/services/agents')}
				selection={select(EntityType._Global, { scope: '$$eip8004Services' }).$$eip8004Services}
				id='agents'
				open={true}
				title='ERC-8004 Registrations'
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
