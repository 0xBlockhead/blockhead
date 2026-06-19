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
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(`/farcaster/user/${page.params.userId}`)}
	id={page.params.userId}
>
	{#snippet Summary({ open: _open })}
		<FarcasterUserView
			selection={select(EntityType.FarcasterUser, { fid: Number(page.params.userId) })}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
