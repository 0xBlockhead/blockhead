<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<Page>
	<LensAccountView
		href={
			resolve('/(social)/(lens)/lens/account/[address=evmAddress]', {
				address: params.address,
			})
		}
		selection={
			select(EntityType.LensAccount, {
				address: decodeURIComponent(params.address),
			}, {
				sources: [
					Source.Lens_Graphql,
				],
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
