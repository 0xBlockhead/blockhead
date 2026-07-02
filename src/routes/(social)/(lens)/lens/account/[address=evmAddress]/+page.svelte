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
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<svelte:head>
	<title>Lens account • Blockhead</title>
</svelte:head>


<Page>
	<LensAccountView
		href={
			resolve('/(social)/(lens)/lens/account/[address=evmAddress]', {
				address: params.address,
			})
		}
		selection={
			select(EntityType.LensAccount, data.selector, {
				fields: {
					$icon: true,
					displayName: true,
					createdAt: true,
					owner: true,
					score: true,
					iconUrl: true,
					bio: true,
				},
			})
		}
	/>
</Page>
