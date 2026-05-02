<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
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
			<NetworkForksView
				entityFieldReference={{
					entityType: EntityType._Global,
					entityId: {},
					fieldName: '$$networkForks',
				}}
				href={resolve('/forks')}
				id="forks"
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
