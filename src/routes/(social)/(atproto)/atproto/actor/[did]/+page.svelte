<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
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
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<svelte:head>
	<title>AT Protocol account • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoActorView
		href={
			resolve('/(social)/(atproto)/atproto/actor/[did]', {
				did: params.did,
			})
		}
		selection={
			select(EntityType.AtprotoActor, data.selector, {
				fields: {
					$icon: true,
					displayName: true,
					indexedAt: true,
					$banner: true,
					description: true,
				},
			})
		}
	/>
</Page>
