<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Profile notes • Blockhead</title>
</svelte:head>


<Page>
	<NostrNotesView
		href={
			resolve('/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes', {
				pubkey: params.pubkey,
			})
		}
		title='Profile notes'
		selection={
			select(EntityType.NostrProfile, data.selector)[EntityProxyField]<EntityType.NostrNote>('$$notes', {
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
			})
		}
		id='notes'
	/>
</Page>
