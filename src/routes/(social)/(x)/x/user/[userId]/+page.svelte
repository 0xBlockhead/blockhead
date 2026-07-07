<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { xUserSelectorFromRouteParam } from '$/lib/x.ts'
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
	import XUserView from '$/views/XUserView.svelte'
</script>


<Page>
	<XUserView
		href={
			resolve('/(social)/(x)/x/user/[userId]', {
				userId: params.userId,
			})
		}
		selection={
			select(EntityType.XUser, xUserSelectorFromRouteParam(decodeURIComponent(params.userId)), {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
				fields: {
					$icon: true,
					name: true,
					createdAt: true,
					verified: true,
					location: true,
					websiteUrl: true,
					description: true,
				},
			})
		}
	/>
</Page>
