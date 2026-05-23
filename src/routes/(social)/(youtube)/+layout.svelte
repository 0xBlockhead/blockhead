<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
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
			entityId={{
				scope: 'YouTubeNetwork',
			}}
			href={resolve('/youtube')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
