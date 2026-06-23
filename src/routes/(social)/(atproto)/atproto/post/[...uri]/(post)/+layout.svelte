<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const uri = $derived(
		page.params.uri ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(atproto)/atproto/post/[...uri]', {
		uri: encodeURIComponent(uri),
	})}
	id={uri}
>
	{#snippet Summary({ open: _open })}
		<AtprotoPostView
			selection={
				select(
					EntityType.AtprotoPost,
					{
						uri: decodeURIComponent(uri),
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
