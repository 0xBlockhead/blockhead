<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { type as arktype } from 'arktype'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { page } from '$app/state'


	// State
	const selector = $derived(
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
	{#if selector}
		<FarcasterCastView
			variant="feed"
			selection={select(EntityType.FarcasterCast, selector)}
		/>
	{/if}
</Page>
