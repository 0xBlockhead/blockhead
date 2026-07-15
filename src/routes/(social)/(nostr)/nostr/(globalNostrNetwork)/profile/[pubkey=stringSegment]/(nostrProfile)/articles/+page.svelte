<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<svelte:head>
	<title>Profile articles • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticlesView
		href={
			resolve('/nostr/profile/[pubkey=stringSegment]/articles', {
				pubkey: params.pubkey,
			})
		}
		title='Profile articles'
		selection={
			select(EntityType.NostrProfile, data.selector).$$articles({
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
				count: true,
			})
		}
		id='articles'
	/>
</Page>
