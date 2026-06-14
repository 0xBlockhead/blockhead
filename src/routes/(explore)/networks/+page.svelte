<script lang="ts">
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
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$evmNetworks',
				}}
				id="networks:evm"
				open
			/>
		{/snippet}

		{#snippet SectionBitcoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:bitcoin"
				networkIds={[{ networkSlug: 'bitcoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionLightning({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:lightning"
				networkIds={[{ networkSlug: 'lightning' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionZcash({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:zcash"
				networkIds={[{ networkSlug: 'zcash' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionFilecoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:filecoin"
				networkIds={[{ networkSlug: 'filecoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionSolana({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:solana"
				networkIds={[{ networkSlug: 'solana' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionCosmosSdkCometBft({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:cosmos-sdk-comet-bft"
				networkIds={[{ networkSlug: 'cosmos' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionPolkadotSdk({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:polkadot-sdk"
				networkIds={[{ networkSlug: 'polkadot' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionHyperliquid({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:hyperliquid"
				networkIds={[{ networkSlug: 'hyperliquid' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionLogos({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:logos"
				networkIds={[{ networkSlug: 'logos' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionQuilibrium({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:quilibrium"
				networkIds={[{ networkSlug: 'quilibrium' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionNear({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:near"
				networkIds={[{ networkSlug: 'near' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionMonero({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:monero"
				networkIds={[{ networkSlug: 'monero' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionLitecoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:litecoin"
				networkIds={[{ networkSlug: 'litecoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionDogecoin({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:dogecoin"
				networkIds={[{ networkSlug: 'dogecoin' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionBitcoinCash({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:bitcoin-cash"
				networkIds={[{ networkSlug: 'bitcoin-cash' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionTron({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:tron"
				networkIds={[{ networkSlug: 'tron' }]}
				open
				title={label}
			/>
		{/snippet}

		{#snippet SectionZeroG({ id: _id, label: label })}
			<NetworksView
				href={resolve('/networks')}
				entityFieldReference={{
					entityType: EntityType._Global,
					selector: { scope: '$$networks' },
					fieldName: '$$networks',
				}}
				id="networks:zero-g"
				networkIds={[{ networkSlug: '0g' }]}
				open
				title={label}
			/>
		{/snippet}
	</CollapsibleTabs>
</Page>
