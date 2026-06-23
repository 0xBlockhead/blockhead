<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const userId = $derived(
		page.params.userId ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId=farcasterFid]', {
		userId: String(userId),
	})}
	id={userId}
>
	{#snippet Summary({ open: _open })}
		<FarcasterUserView
			selection={
				select(
					EntityType.FarcasterUser,
					{
						fid: Number(userId),
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
