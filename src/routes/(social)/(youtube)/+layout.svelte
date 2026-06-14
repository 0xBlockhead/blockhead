<script lang="ts">
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YouTubeView from '$/views/YouTubeView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/youtube')}
	id={stringify({
		scope: 'YouTubeNetwork',
	})}
>
	{#snippet Summary({ open: _open })}
		<YouTubeView
			selector={{
				scope: 'YouTubeNetwork',
			}}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
