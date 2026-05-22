<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const fullname = $derived(
		page.params.fullname ?? '',
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(reddit)/reddit/link/[fullname]', {
		fullname: encodeURIComponent(fullname),
	})}
	id={fullname}
>
	{#snippet Summary({ open: _open })}
		<RedditLinkView
			entityId={{ fullname: decodeURIComponent(fullname) }}
			href={resolve('/(social)/(reddit)/reddit/link/[fullname]', {
				fullname: encodeURIComponent(fullname),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
