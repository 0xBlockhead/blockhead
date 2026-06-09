<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	const hubKey = 'explore'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{ scope: 'Explore' }}
		title="Explore"
		href={resolve('/explore')}
	>
		{#snippet children({ open: hubOpen,
		})}
			<CollapsibleTabs
				id={`${hubKey}:hub`}
				sectionIdPrefix={hubKey}
				sections={[
					{ id: 'networks', label: 'Networks' },
					{ id: 'upgrades', label: 'Upgrades' },
					{ id: 'ipfs', label: 'IPFS' },
					{ id: 'swarm', label: 'Swarm' },
					{ id: 'proposals', label: 'Proposals' },
				]}
				data-card
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

				{#snippet SectionNetworks({ id, label })}
					<NetworksView
						href={resolve('/networks')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: { scope: '$$networks' },
							fieldName: '$$networks',
						}}
						id="networks"
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionUpgrades({ id, label })}
					<EthereumNetworkUpgradesView
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: { scope: '$$networkUpgrades' },
							fieldName: '$$networkUpgrades',
						}}
						id="upgrades"
						open={hubOpen}
					/>
				{/snippet}

				{#snippet SectionIpfs({ id, label })}
					<h2>
						<a href={resolve('/ipfs')}>IPFS</a>
					</h2>

					<p data-text="muted">
					Open resolver-backed IPFS and IPNS resource pages from raw CIDs, protocol URIs, or public gateway URLs.
				</p>
			{/snippet}

			{#snippet SectionSwarm({ id, label })}
				<h2>
					<a href={resolve('/swarm')}>Swarm</a>
				</h2>

				<p data-text="muted">
					Open resolver-backed Swarm BZZ resource pages from raw references, `bzz://` URIs, or public gateway URLs.
				</p>
			{/snippet}

			{#snippet SectionProposals({ id, label })}
				<SpecificationRealmsView
					entityFieldReference={{
						entityType: EntityType._Global,
						entityId: { scope: '$$specificationRealms' },
						fieldName: '$$specificationRealms',
					}}
					id="proposal-realms"
					open={hubOpen}
					title="Proposals"
				/>
			{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</GlobalView>
</Page>
