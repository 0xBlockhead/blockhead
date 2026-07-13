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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XUser, data.selector, {
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
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? ''), String((pageSelection.entitySelector.username) ?? ''), String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'X user' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).username) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'X user')))


	// Components
	import Page from '$/components/Page.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • X user • Blockhead</title>
</svelte:head>


<Page>
	<XUserView
		href={
			resolve('/x/user/[userId=stringSegment]', {
				userId: params.userId,
			})
		}
		selection={pageSelection}
	/>
</Page>
