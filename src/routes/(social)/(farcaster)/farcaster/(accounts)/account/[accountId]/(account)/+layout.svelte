<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
			selection={select(EntityType.BlockheadFarcasterAccountConnection, { fid: Number(page.params.accountId) })}
			layout={EntityLayout.SummaryInline}
			title="Account"
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
