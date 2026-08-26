<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import { getAppClient } from '$/routes/applicationClient.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
	import { resolve } from '$app/paths'


	// Context
	const select = getAppClient().select


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
