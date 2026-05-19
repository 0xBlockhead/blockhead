<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'swarm'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import SwarmBrowseView from '$/views/SwarmBrowseView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Swarm"
		href={resolve('/swarm')}
	>
		{#snippet children({
			open: _hubOpen,
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
							Swarm
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Browse"
						href={`#${hubKey}:browse`}
					>Browse</a>
				{/snippet}

				{#snippet children({ open: _paneOpen })}
					<section
						id={`${hubKey}:browse`}
						data-scroll-marker-label="Browse"
					>
						<SwarmBrowseView />
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
