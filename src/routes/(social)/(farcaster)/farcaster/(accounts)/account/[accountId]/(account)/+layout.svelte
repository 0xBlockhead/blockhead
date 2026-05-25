<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]',
		{ accountId: String(page.params.accountId) },
	)}
	id={page.params.accountId}
>
	{#snippet Summary({ open: _open })}
		<BlockheadFarcasterAccountConnectionView
			entityId={{ fid: Number(page.params.accountId) }}
			layout={EntityLayout.SummaryInline}
			title="Account"
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
