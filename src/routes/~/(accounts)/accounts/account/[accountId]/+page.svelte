<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<section>
		<NetworkView
			entityId={{ chainId: 1 }}
			href={resolve('/(explore)/(networks)/network/[networkId]', {
				networkId: '1',
			})}
			layout={EntityLayout.Summary}
			open={false}
		/>
	</section>

	<ActorView
		entityId={{
			$network: { chainId: 1 },
			address: params.accountId as `0x${string}`,
		}}
		href={resolve('/~/(accounts)/accounts/account/[accountId]', params)}
	/>
</Page>
