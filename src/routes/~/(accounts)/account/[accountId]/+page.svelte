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
</script>


<Page>
	<ActorView
		entityId={{
			address: params.accountId as `0x${string}`,
		}}
		href={resolve('/~/(accounts)/account/[accountId]', params)}
	/>
</Page>
