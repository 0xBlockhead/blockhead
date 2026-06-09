<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { page } from '$app/state'


	// State
	const entityId = $derived(
		((clientUrl) => (
			clientUrl instanceof arktype.errors ?
				undefined
			:
				{
					clientUrl,
				}
		))(UrlString(page.url.searchParams.get('url') ?? page.url.searchParams.get('u') ?? '')),
	)

	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
	{#if entityId}
		<FarcasterCastView
			variant="feed"
			{entityId}
		/>
	{/if}
</Page>
