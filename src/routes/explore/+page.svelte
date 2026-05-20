<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	const hubKey = 'explore'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import NetworkUpgradesView from '$/views/NetworkUpgradesView.svelte'
	import ProposalRealmsView from '$/views/ProposalRealmsView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Explore"
		href={resolve('/explore')}
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
							Explore
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Networks"
						href={`#${hubKey}:networks`}
					>Networks</a>
					<a
						data-scroll-marker-label="Upgrades"
						href={`#${hubKey}:upgrades`}
					>Upgrades</a>
					<a
						data-scroll-marker-label="IPFS"
						href={`#${hubKey}:ipfs`}
					>IPFS</a>
					<a
						data-scroll-marker-label="Swarm"
						href={`#${hubKey}:swarm`}
					>Swarm</a>
					<a
						data-scroll-marker-label="Proposals"
						href={`#${hubKey}:proposals`}
					>Proposals</a>
				{/snippet}

				{#snippet body({ open: _paneOpen })}
					<section
						id={`${hubKey}:networks`}
						data-scroll-marker-label="Networks"
					>
						<NetworksView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$networks',
							}}
							href={resolve('/networks')}
							id="networks"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:upgrades`}
						data-scroll-marker-label="Upgrades"
					>
						<NetworkUpgradesView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$networkUpgrades',
							}}
							href={resolve('/upgrades')}
							id="upgrades"
							open={hubOpen}
						/>
					</section>

					<section
						id={`${hubKey}:ipfs`}
						data-scroll-marker-label="IPFS"
						data-card
					>
						<h2>
							<a href={resolve('/ipfs')}>IPFS</a>
						</h2>

						<p data-text="muted">
							Open resolver-backed IPFS and IPNS resource pages from raw CIDs, protocol URIs, or public gateway URLs.
						</p>
					</section>

					<section
						id={`${hubKey}:swarm`}
						data-scroll-marker-label="Swarm"
						data-card
					>
						<h2>
							<a href={resolve('/swarm')}>Swarm</a>
						</h2>

						<p data-text="muted">
							Open resolver-backed Swarm BZZ resource pages from raw references, `bzz://` URIs, or public gateway URLs.
						</p>
					</section>

					<section
						id={`${hubKey}:proposals`}
						data-scroll-marker-label="Proposals"
					>
						<ProposalRealmsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$proposalRealms',
							}}
							href={resolve('/proposals')}
							id="proposal-realms"
							open={hubOpen}
							title="Proposals"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
