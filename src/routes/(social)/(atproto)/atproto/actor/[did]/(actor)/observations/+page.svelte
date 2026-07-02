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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Account observations • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActor_TimestampsView
		href={
			resolve('/(social)/(atproto)/atproto/actor/[did]/(actor)/observations', {
				did: params.did,
			})
		}
		title='Account observations'
		selection={
			select(EntityType.AtprotoActor, {
				did: decodeURIComponent(params.did),
			})[EntityProxyField]<EntityType.AtprotoActor_Timestamp>('$$timestamps')
		}
		id='AtprotoActor_TimestampsView-page'
	/>
</Page>
