<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
	import { Source } from '$/sources/Source.ts'
	import { resolve } from '$app/paths'


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
				<HeadingComponent>Explore</HeadingComponent>
			</header>
		{/snippet}

		{#snippet SectionNetworks()}
			<NetworksView
				href={resolve('/(explore)/networks')}
				selection={select(EntityType._Global, { scope: '$$networks' })[EntityProxyField]<EntityType.Network>('$$networks')}
				id='networks'
				open={true}
			/>
		{/snippet}

		{#snippet SectionUpgrades()}
			<EthereumNetworkUpgradesView
				selection={select(EntityType._Global, { scope: '$$networkUpgrades' })[EntityProxyField]<EntityType.EthereumNetworkUpgrade>('$$networkUpgrades')({
					sources: [Source.Constants_Internal],
					limit: 512,
				})}
				id='upgrades'
				open={true}
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
				selection={select(EntityType._Global, { scope: '$$specificationRealms' })[EntityProxyField]<EntityType.SpecificationRealm>('$$specificationRealms')({
					sources: [Source.Constants_Internal],
				})}
				id='proposal-realms'
				open={true}
				title='Proposals'
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
