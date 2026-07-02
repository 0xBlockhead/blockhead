<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			resolve('/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/articles', {
				pubkey: params.pubkey,
			})
		}
		title='Profile articles'
		selection={select(EntityType.NostrProfile, data.selector)[EntityProxyField]<EntityType.NostrArticle>('$$articles')}
		id='NostrArticlesView-page'
	/>
</Page>
