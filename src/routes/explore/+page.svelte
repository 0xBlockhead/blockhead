<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworksView from '$/views/NetworksView.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'Explore'}
		href={resolve('/explore')}
	>
		{#snippet children()}
			<section>
				<NetworksView
					href={resolve('/networks')}
					id="networks"
				/>
			</section>

			<section>
				<NetworkForksView
					href={resolve('/forks')}
					id="forks"
				/>
			</section>

			<section>
				<ProposalsView />
			</section>
		{/snippet}
	</GlobalView>
</Page>
