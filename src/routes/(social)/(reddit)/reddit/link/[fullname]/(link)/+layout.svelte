<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()


	// (Derived)
	const fullname = $derived(
		page.params.fullname ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
