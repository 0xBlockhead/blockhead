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
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<svelte:head>
	<title>Profile reposts • Blockhead</title>
</svelte:head>


<Page>
	<NostrRepostsView
		href={
			resolve('/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/reposts', {
				pubkey: params.pubkey,
			})
		}
		title='Profile reposts'
		selection={
			select(EntityType.NostrProfile, data.selector).$$reposts({
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
			})
		}
		id='reposts'
	/>
</Page>
