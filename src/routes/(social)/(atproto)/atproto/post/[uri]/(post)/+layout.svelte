<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const uri = $derived(
		page.params.uri ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(atproto)/atproto/post/[uri]', {
		uri: encodeURIComponent(uri),
	})}
	id={uri}
>
	{#snippet Summary({ open: _open })}
		<AtprotoPostView
			entityId={{ uri: decodeURIComponent(uri) }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
