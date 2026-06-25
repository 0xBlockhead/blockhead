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
		'pubkey',
		'displayName',
		'nip05',
	],
	content: {
		dl: [
			[
				'pubkey',
				'displayName',
				'nip05',
				'$banner',
				'website',
			],
			[
				{
					label: 'lightning address/URI',
				},
				'metadataUpdatedAt',
				'$$notes',
				'$$articles',
				'$$reposts',
			],
		],
		blocks: [
			[
				{
					label: 'about text',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile metadata',
				items: [
					{
						label: 'kind-0 content',
					},
					{
						label: 'media refs',
					},
					'nip05',
					{
						label: 'lightning fields',
					},
				],
			},
			{
				label: 'Notes',
				items: [
					{
						label: 'notes authored by this pubkey',
					},
				],
			},
			{
				label: 'Articles',
				items: [
					{
						label: 'addressable articles authored by this pubkey',
					},
				],
			},
			{
				label: 'Reposts',
				items: [
					{
						label: 'repost events authored by this pubkey',
					},
				],
			},
			{
				label: 'Relay evidence',
				items: [
					{
						label: 'relays/indexers that returned the latest kind-0 event',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'notes',
			label: 'notes',
			field: '$$notes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'articles',
			label: 'articles',
			field: '$$articles',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'reposts',
			label: 'reposts',
			field: '$$reposts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrProfile>
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
	entityType={EntityType.NostrProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
