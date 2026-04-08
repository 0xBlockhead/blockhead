<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<section>
		<NetworkForkView
			entityId={{
				$network: { chainId: Number(params.networkId) },
				forkId: params.forkSlug,
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]',
				params,
			)}
		>
			{#snippet children()}
				<section>
					<EvmBlocksView
						entityId={{ chainId: Number(params.networkId) }}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]/(fork)/blocks',
							params,
						)}
						id="blocks"
					/>
				</section>

				<section>
					<NetworkView
						entityId={{ chainId: Number(params.networkId) }}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]',
							params,
						)}
						layout={EntityLayout.Summary}
					/>
				</section>

				<section>
					<NetworkForksView
						entityId={{ chainId: Number(params.networkId) }}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/forks',
							params,
						)}
						id="forks"
					/>
				</section>
			{/snippet}
		</NetworkForkView>
	</section>
</Page>
