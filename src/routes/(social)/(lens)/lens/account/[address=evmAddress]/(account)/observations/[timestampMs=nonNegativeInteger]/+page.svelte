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
	import LensAccount_TimestampView from '$/views/LensAccount_TimestampView.svelte'
</script>


<Page>
	<LensAccount_TimestampView
		href={
			resolve('/(social)/(lens)/lens/account/[address=evmAddress]/(account)/observations/[timestampMs=nonNegativeInteger]', {
				address: params.address,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.LensAccount_Timestamp, {
				$account: {
					address: decodeURIComponent(params.address),
				},
				timestampMs: Number(params.timestampMs),
			}, {
				sources: [
					Source.Lens_Graphql,
				],
				fields: {
					followerCount: true,
					followingCount: true,
				},
			})
		}
	/>
</Page>
