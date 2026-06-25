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
		'address',
		'localName',
		'legacyProfileId',
	],
	content: {
		dl: [
			[
				'address',
				'localName',
				'legacyProfileId',
				'displayName',
				'bio',
			],
			[
				'owner',
				'score',
				{
					label: 'member state',
				},
				'createdAt',
				{
					label: 'icon URL/media',
				},
			],
			[
				'$username',
				{
					label: 'latest follower/following snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Posts',
				items: [
					{
						label: 'posts authored by this account',
					},
				],
			},
			{
				label: 'Username',
				items: [
					{
						label: 'linked Lens username',
					},
				],
			},
			{
				label: 'Account managers',
				items: [
					{
						label: 'delegated manager permission rows',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/following observations',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'owner EVM account when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account GraphQL payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'account-managers',
			label: 'account managers',
			field: '$$accountManagers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'posts',
			label: 'posts',
			field: '$$posts',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensAccount>
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
	entityType={EntityType.LensAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
