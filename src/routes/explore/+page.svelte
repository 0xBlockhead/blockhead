<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
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
		<section>
			<NetworksView
				data-e2e="networks-panel"
				entityFieldReference={{
					entityType: EntityType._Global,
					entityId: {},
					fieldName: '$$networks',
				}}
				href={resolve('/networks')}
				id="networks"
			/>
		</section>

		<section>
			<NetworkUpgradesView
				entityFieldReference={{
					entityType: EntityType._Global,
					entityId: {},
					fieldName: '$$networkUpgrades',
				}}
				href={resolve('/upgrades')}
				id="upgrades"
			/>
		</section>

		<section data-card>
			<h2>
				<a href={resolve('/ipfs')}>IPFS</a>
			</h2>

			<p data-text="muted">
				Open resolver-backed IPFS and IPNS resource pages from raw CIDs, protocol URIs, or public gateway URLs.
			</p>
		</section>

		<section data-card>
			<h2>
				<a href={resolve('/swarm')}>Swarm</a>
			</h2>

			<p data-text="muted">
				Open resolver-backed Swarm BZZ resource pages from raw references, `bzz://` URIs, or public gateway URLs.
			</p>
		</section>

		<section>
			<ProposalRealmsView
				entityFieldReference={{
					entityType: EntityType._Global,
					entityId: {},
					fieldName: '$$proposalRealms',
				}}
				href={resolve('/proposals')}
				id="proposal-realms-explore"
				title="Proposals"
			/>
		</section>
	</GlobalView>
</Page>
