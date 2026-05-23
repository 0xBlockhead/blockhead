<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()


	// Components
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(`/farcaster/user/${page.params.userId}`)}
	id={page.params.userId}
>
	{#snippet Summary({ open: _open })}
		<FarcasterUserView
			entityId={{ fid: Number(page.params.userId) }}
			href={resolve(`/farcaster/user/${page.params.userId}`)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
