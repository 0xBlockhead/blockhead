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
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
</script>


<svelte:head>
	<title>AT Protocol accounts • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActorsView
		href={resolve('/(social)/(atproto)/atproto/actors')}
		title='AT Protocol accounts'
		selection={
			select(EntityType._GlobalAtprotoNetwork, {
				scope: '_GlobalAtprotoNetwork',
			})[EntityProxyField]<EntityType.AtprotoActor>('$$observedActors', {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
		id='observed-actors'
	/>
</Page>
