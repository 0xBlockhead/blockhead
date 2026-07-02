<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<svelte:head>
	<title>X posts • Blockhead</title>
</svelte:head>


<Page>
	<XPostsView
		href={resolve('/(social)/(x)/x/posts')}
		title='X posts'
		selection={
			select(EntityType.XNetwork, {
				scope: 'XNetwork',
			})[EntityProxyField]<EntityType.XPost>('$$xPosts')
		}
		id='XPostsView-page'
	/>
</Page>
