<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(`/farcaster/channel/${page.params.channelId}`)}
	id={page.params.channelId}
>
	{#snippet Summary({ open: _open })}
		<FarcasterChannelView
			entityId={{ id: page.params.channelId }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
