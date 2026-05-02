<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const uri = $derived(
		page.params.uri ?? '',
	)


	// Components
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/atproto/post/[uri]', {
		uri: encodeURIComponent(uri),
	})}
	id={uri}
>
	{#snippet Summary({ open: _open })}
		<AtprotoPostView
			entityId={{ uri: decodeURIComponent(uri) }}
			href={resolve('/(social)/atproto/post/[uri]', {
				uri: encodeURIComponent(uri),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
