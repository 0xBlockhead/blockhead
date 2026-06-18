<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EvmNetworksView from '$/views/EvmNetworksView.svelte'
	import Page from '$/components/Page.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<Page>
	<CollapsibleTabs
		open
		sectionIdPrefix="network-architecture"
		sections={collapsibleTabsSections([
			{ id: 'evm', label: 'EVM' },
			{ id: 'bitcoin', label: 'Bitcoin' },
			{ id: 'lightning', label: 'Lightning Network' },
			{ id: 'zcash', label: 'Zcash' },
			{ id: 'filecoin', label: 'Filecoin' },
			{ id: 'solana', label: 'Solana' },
			{ id: 'cosmos-sdk-comet-bft', label: 'Cosmos SDK + CometBFT' },
			{ id: 'polkadot-sdk', label: 'Polkadot SDK' },
			{ id: 'hyperliquid', label: 'Hyperliquid' },
			{ id: 'logos', label: 'Logos' },
			{ id: 'quilibrium', label: 'Quilibrium' },
			{ id: 'near', label: 'NEAR' },
			{ id: 'monero', label: 'Monero' },
			{ id: 'litecoin', label: 'Litecoin' },
			{ id: 'dogecoin', label: 'Dogecoin' },
			{ id: 'bitcoin-cash', label: 'Bitcoin Cash' },
			{ id: 'tron', label: 'TRON' },
			{ id: 'zero-g', label: '0G' },
		])}
		data-card
		scrollContainerProps={{
			'data-scroll-container': 'block',
		}}
	>
		{#snippet Summary({ open: _summaryOpen })}
			<header
				data-row-item="flexible"
				data-row="wrap gap-4"
			>
				<h1>
					<a href={resolve('/networks')}>Networks</a>
				</h1>
			</header>
		{/snippet}

		{#snippet Annotation({ open: _annotationOpen })}
			<span data-text="annotation">Architectures</span>
		{/snippet}

		{#snippet SectionEvm({ id: _id, label: _label })}
			<EvmNetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$evmNetworks}
				id="networks:evm"
				open
			/>
		{/snippet}

		{#snippet SectionBitcoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:bitcoin"
				networkSelectors={[{ slug: 'bitcoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionLightning({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:lightning"
				networkSelectors={[{ slug: 'lightning' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionZcash({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:zcash"
				networkSelectors={[{ slug: 'zcash' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionFilecoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:filecoin"
				networkSelectors={[{ slug: 'filecoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionSolana({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:solana"
				networkSelectors={[{ slug: 'solana' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionCosmosSdkCometBft({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:cosmos-sdk-comet-bft"
				networkSelectors={[{ slug: 'cosmos' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionPolkadotSdk({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:polkadot-sdk"
				networkSelectors={[{ slug: 'polkadot' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionHyperliquid({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:hyperliquid"
				networkSelectors={[{ slug: 'hyperliquid' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionLogos({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:logos"
				networkSelectors={[{ slug: 'logos' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionQuilibrium({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:quilibrium"
				networkSelectors={[{ slug: 'quilibrium' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionNear({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:near"
				networkSelectors={[{ slug: 'near' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionMonero({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:monero"
				networkSelectors={[{ slug: 'monero' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionLitecoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:litecoin"
				networkSelectors={[{ slug: 'litecoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionDogecoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:dogecoin"
				networkSelectors={[{ slug: 'dogecoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionBitcoinCash({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:bitcoin-cash"
				networkSelectors={[{ slug: 'bitcoin-cash' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionTron({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:tron"
				networkSelectors={[{ slug: 'tron' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionZeroG({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				selection={select(
			EntityType._Global,
			{ scope: '$$networks' }
		).$$networks}
				id="networks:zero-g"
				networkSelectors={[{ slug: '0g' }]}
				open
				title={label}
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
