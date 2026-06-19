<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
	href={resolve('/(social)/(atproto)/atproto/post/[...uri]', {
		uri: encodeURIComponent(uri),
	})}
	id={uri}
>
	{#snippet Summary({ open: _open })}
		<AtprotoPostView
			selection={select(EntityType.AtprotoPost, { uri: decodeURIComponent(uri) })}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
