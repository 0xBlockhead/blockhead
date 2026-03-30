<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<Page>
	<ActorView
		entityId={{
			$network: { chainId: 1 },
			address: params.accountId as `0x${string}`,
		}}
		href={resolve(
			'/(social)/(xmtp)/xmtp/(accounts)/account/[accountId]',
			params,
		)}
	/>
</Page>
