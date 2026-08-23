<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ActivityPubInstanceModeratedDomain, {
		$observation: data.selector,
		digest: params.digest,
	}, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			domain: true,
			severity: true,
			comment: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstanceModeratedDomainView from '$/views/ActivityPubInstanceModeratedDomainView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'ActivityPub instance moderated domain' : [pageSelection.entity.domain, pageSelection.entity.severity, (pageSelection.entity.comment ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance moderated domain')} • ActivityPub instance moderated domain • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ActivityPub instance moderated domain'} • ActivityPub instance moderated domain • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ActivityPubInstanceModeratedDomainView
		selection={pageSelection}
	/>
	{/if}
</Page>
