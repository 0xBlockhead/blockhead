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
				sectionIdPrefix={hubKey}
				sections={[
					{ id: 'profiles', label: 'Profiles' },
					{ id: 'sources', label: 'Sources' },
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
							Manage
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionProfiles({ id, label })}
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
				{/snippet}

				{#snippet SectionSources({ id, label })}
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
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
