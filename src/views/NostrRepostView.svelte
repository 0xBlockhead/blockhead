<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'event id',
		},
		'kind',
		{
			label: 'author',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'event id',
				},
				'kind',
				{
					label: 'author',
				},
				'createdAt',
				{
					label: 'reposted event id',
				},
				{
					label: 'reposted note',
				},
				{
					label: 'reposted article',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Reposted target',
				items: [
					{
						label: 'target note or article',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author Nostr profile',
					},
				],
			},
			{
				label: 'Raw event',
				items: [
					{
						label: 'kind/pubkey/tags/signature/source relays',
					},
				],
			},
			{
				label: 'Relay evidence',
				items: [
					{
						label: 'filters',
					},
					{
						label: 'relays/indexers that returned the repost',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrRepost>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.NostrRepost}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
