<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<svelte:head>
	<title>Nostr articles • Blockhead</title>
</svelte:head>


<Page>
	<NostrArticlesView
		href={resolve('/(social)/(nostr)/nostr/articles')}
		title='Nostr articles'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			})[EntityProxyField]<EntityType.NostrArticle>('$$observedArticles', {
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
			})
		}
		id='observed-articles'
	/>
</Page>
