<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	lists: [
		{
			id: 'casts',
			label: 'Casts',
			limit: 25,
			query: {
				sources: [
					'Snapchain_Rest',
				],
				limit: 25,
			},
			item: 'link',
			itemHref: {
				label: '/farcaster/cast/[hash]',
			},
		},
	],
	closed: [
		'fid',
		'hash',
		{
			label: 'username/hash-prefix or client URL selector context',
		},
	],
	content: {
		dl: [
			[
				'fid',
				'hash',
				{
					label: 'username/hash-prefix or client URL selector context',
				},
				{
					label: 'author',
				},
				'text',
				'timestamp',
				{
					label: 'parent cast',
				},
				{
					label: 'parent URL',
				},
				{
					label: 'thread hash',
				},
				{
					label: 'channel',
				},
				{
					label: 'posted-via app',
				},
				'mentions',
				{
					label: 'mentioned profiles/channels',
				},
				{
					label: 'embeds',
				},
				{
					label: 'latest like/recast/reply snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent/thread',
				items: [
					{
						label: 'parent/root cast refs and thread hash',
					},
				],
			},
			{
				label: 'Embeds',
				items: [
					{
						label: 'ordered embed rows',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author Farcaster user',
					},
				],
			},
			{
				label: 'Channel',
				items: [
					{
						label: 'linked channel when present',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped engagement observations',
					},
				],
			},
		],
	},
	query: {
		policies: [
			{
				when: {
					hasSelectorFields: [
						'fid',
						'hash',
					],
				},
				sources: [
					'Snapchain_Rest',
				],
				fields: [
					'fid',
					'hash',
					'text',
					'timestamp',
				],
			},
			{
				sources: [
					'Farcaster_Rest',
				],
				fields: [
					'fid',
					'hash',
					'text',
					'timestamp',
					'username',
					'hashPrefix',
					'clientUrl',
					'threadHash',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCast>
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
	entityType={EntityType.FarcasterCast}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
