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
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<svelte:head>
	<title>Markets • Blockhead</title>
</svelte:head>


<Page>
	<MarketsView
		href={resolve('/(assets)/markets')}
		title='Markets'
		selection={
			select(EntityType._Global, {
				scope: '$$markets',
			})[EntityProxyField]<EntityType.Market>('$$markets')
		}
		id='markets'
	/>
</Page>
