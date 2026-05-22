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
	<NetworkView
		entityId={{ chainId: 1 }}
		href={resolve('/(explore)/(networks)/network/[networkId]', {
			networkId: '1',
		})}
		layout={EntityLayout.SummaryDetails}
	/>

	<ActorView
		entityId={{
			address: params.accountId as `0x${string}`,
		}}
		href={resolve(
			'/(social)/(xmtp)/xmtp/(accounts)/account/[accountId]',
			params,
		)}
	/>
</Page>
