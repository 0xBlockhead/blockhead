<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	const hubKey = 'manage'


	// Components
	import BlockheadSessionsView from '$/views/BlockheadSessionsView.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'Manage'}
		href={resolve('/~/manage')}
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
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
							Manage
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Profiles"
						href={`#${hubKey}:profiles`}
					>Profiles</a>
					<a
						data-scroll-marker-label="Sources"
						href={`#${hubKey}:sources`}
					>Sources</a>
				{/snippet}

				{#snippet body({ open: _paneOpen })}
					<section
						id={`${hubKey}:profiles`}
						data-scroll-marker-label="Profiles"
					>
						<BlockheadSessionsView
							href={resolve('/~/manage/profiles')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$blockheadSessions',
							}}
							id="profiles"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:sources`}
						data-scroll-marker-label="Sources"
					>
						<BlockheadSourcesView
							href={resolve('/~/manage/sources')}
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$blockheadSources',
							}}
							id="sources"
							open={hubOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
