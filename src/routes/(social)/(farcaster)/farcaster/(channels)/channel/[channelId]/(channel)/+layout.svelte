<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children, params } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(`/farcaster/channel/${params.channelId}`)}
	id={params.channelId}
>
	{#snippet Summary({ open: _open })}
		<FarcasterChannelView
			selector={{ id: params.channelId }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
