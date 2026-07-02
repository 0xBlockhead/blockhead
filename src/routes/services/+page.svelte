<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import EvmNftsView from '$/views/EvmNftsView.svelte'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
		scrollContainerProps={{
			'data-row': 'start align-start',
			style: '--carousel-basis: 40ch',
		}}
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
				selection={select(EntityType._Global, { scope: '$$eip8004Services' })[EntityProxyField]<EntityType.EvmNft>('$$eip8004Services')({
					sources: [Source.Eip8004Scan_Rest],
					limit: 100,
				})}
				id='agents'
				open={true}
				title='ERC-8004 Registrations'
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
