<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Manage • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='manage:hub'
		sectionIdPrefix='manage'
		sections={[
			{ id: 'sources', label: 'Sources' },
		]}
		data-card
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Manage</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionSources()}
			<BlockheadSourcesView
				href={resolve('/~/manage/sources')}
				selection={select(EntityType._Global, { scope: '$$blockheadSources' }).$$blockheadSources}
				id='sources'
				open={true}
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
