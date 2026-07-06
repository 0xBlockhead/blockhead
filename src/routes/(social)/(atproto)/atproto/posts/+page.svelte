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
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<svelte:head>
	<title>AT Protocol posts • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostsView
		href={resolve('/(social)/(atproto)/atproto/posts')}
		title='AT Protocol posts'
		selection={
			select(EntityType._GlobalAtprotoNetwork, {
				scope: '_GlobalAtprotoNetwork',
			})[EntityProxyField]<EntityType.AtprotoPost>('$$observedPosts', {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
		id='observed-posts'
	/>
</Page>
