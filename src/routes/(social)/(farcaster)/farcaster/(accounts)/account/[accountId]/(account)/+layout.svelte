<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const accountId = $derived(
		page.params.accountId ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]', {
		accountId: String(accountId),
	})}
	id={accountId}
>
	{#snippet Summary({ open: _open })}
		<BlockheadFarcasterAccountConnectionView
			selection={
				select(
					EntityType.BlockheadFarcasterAccountConnection,
					{
						fid: Number(accountId),
					}
				)
			}
			layout={EntityLayout.SummaryInline}
			title="Account"
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
