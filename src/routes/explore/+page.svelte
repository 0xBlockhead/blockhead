<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Explore • Blockhead</title>
</svelte:head>


<Page>
	<CollapsibleTabs
		id='explore:hub'
		sectionIdPrefix='explore'
		sections={[
			{ id: 'networks', label: 'Networks' },
			{ id: 'upgrades', label: 'Upgrades' },
			{ id: 'ipfs', label: 'IPFS' },
			{ id: 'swarm', label: 'Swarm' },
			{ id: 'proposals', label: 'Proposals' },
		]}
		data-card
	>
		{#snippet Summary({ open: _open })}
			<header
				data-row-item='flexible'
				data-row='wrap gap-4'
			>
				<HeadingComponent>Explore</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionNetworks()}
			<NetworksView
				href={resolve('/networks')}
				selection={select(EntityType._Global, { scope: '$$networks' }).$$networks}
				id='networks'
				open={true}
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}

		{#snippet SectionUpgrades()}
			<EthereumNetworkUpgradesView
				selection={select(EntityType._Global, { scope: '$$networkUpgrades' }).$$networkUpgrades}
				id='upgrades'
				open={true}
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}

		{#snippet SectionIpfs()}
			<h2><a href={resolve('/ipfs')}>IPFS</a></h2>
			<p data-text='muted'>Open resolver-backed IPFS and IPNS resource pages from raw CIDs, protocol URIs, or public gateway URLs.</p>
		{/snippet}

		{#snippet SectionSwarm()}
			<h2><a href={resolve('/swarm')}>Swarm</a></h2>
			<p data-text='muted'>Open resolver-backed Swarm BZZ resource pages from raw references, bzz:// URIs, or public gateway URLs.</p>
		{/snippet}

		{#snippet SectionProposals()}
			<SpecificationRealmsView
				selection={select(EntityType._Global, { scope: '$$specificationRealms' }).$$specificationRealms}
				id='proposal-realms'
				open={true}
				title='Proposals'
				data-column-item='flexible'
				data-card
				data-scroll-container
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
